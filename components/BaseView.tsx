/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {ref, uploadBytes} from 'firebase/storage';
import {ref as ref2, set} from 'firebase/database';
import {decode, encode} from 'base-64';
import Icon from 'react-native-vector-icons/FontAwesome';

import storage, {database} from './config';
import ChartRes from './res/ChartRes';
import TempandTime from './res/TempandTime';
import TubeRotation from './res/TubeRotation';
function BaseView(props: any): JSX.Element {
  const {fs} = RNFetchBlob;
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [dateURL, setdateURL] = useState<any>([]);
  //handle image data
  const [image, setImage] = useState(' ');
  //handle function classsify
  const [kompor, setKompor] = useState(false);
  const [count, setCount] = useState(0);
  // handle function classsify
  const [count2, setCount2] = useState(1);
  const [show2, setShow2] = useState(false);
  // handle control
  const [feeding, setFeeding] = useState('60');
  const [output, setOutput] = useState('60');
  const [cooling, setCooling] = useState('60');
  const [roasting, setRoasting] = useState('60');
  const [roastingVisible, setRoastingVisible] = useState(false);
  const [start, setStart] = useState(false);
  //handle grap
  const [grap, setGrap] = useState([{x: 0, y: 0}]);
  const [suhu, setSuhu] = useState(0);
  const [timer, setTimer] = useState(0);
  const [suhuRec, setSuhuRec] = useState(0);
  //handle classify
  const [predict, setPredict] = useState('no predict');
  const [confidence, setConfidence] = useState({
    Dark: 0,
    Green: 0,
    Light: 0,
    Medium: 0,
  });
  const [check, setCheck] = useState('Url Predict Unchecked');
  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState('default');
  const [condition2, setCondition2] = useState('default');
  const [imageVisible, setImageVisible] = useState(true);
  const [consoleState, setConsoleState] = useState('');
  const [runningStatus, setRunningStatus] = useState(false);
  //handle textInput
  const [textUri, setTextUri] = useState('http://192.168.100.13');
  const [textUri2, setTextUri2] = useState('http://192.168.100.12');
  //handle stopwatch
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatch, setStopwatch] = useState(0);

  async function running() {
    setConsoleState('start');
    if (typeof atob === 'undefined') {
      global.atob = decode;
    }
    const date = new Date().toDateString();
    const time = new Date().toTimeString();
    await getTemp(date, time);
    setdateURL([...dateURL, {date: date, time: time}]);
    await fetch(`${textUri2}/saved-photo`).then(async res => {
      await storageImage(date, time, await res.blob());
    });

    console.log('running.......');
    setConsoleState('running.......');
    // await uploadDatabaseSuhu(date, time, suhu, timer);
  }
  async function uploadDatabaseSuhu(date: string, time: string, data: any) {
    //upload database
    const databaseRef = ref2(database, `Result/Suhu/${date}/${time}`);

    set(databaseRef, {
      temperature: data.y,
      time: data.x,
    })
      .then(async res => {
        await getEncrypted(date, time);
        console.log(`database suhu sudah terupload ${res}`);
        setConsoleState('database suhu sudah terupload');
      })
      .catch(e => {
        console.log(`gagal upload database suhu ${e} `);
        setConsoleState('gagal upload database suhu ');
      });
  }
  async function uploadDatabaseImage(date: string, time: string, data: any) {
    console.log('running database image function');
    setConsoleState('running database image function');
    //upload database
    const databaseRef = ref2(database, `Result/Image/${date}/${time}`);
    set(databaseRef, {
      predicted: data.predicted_class,
      confidence: {
        Dark: data.class_percentages.Dark,
        Green: data.class_percentages.Green,
        Light: data.class_percentages.Light,
        Medium: data.class_percentages.Medium,
      },
    })
      .then(res => {
        console.log('alhamdullilah');
        setConsoleState('hasil predict telah terupload ke firebase');
        setCount2(count2 + 1);
        console.log(`sekarang perhitungan ke ${count2}`);
        setLoading(false);
      })
      .catch(e => {
        console.log('gagal maning ');
        setConsoleState('gagal upload hasil predict');
      });
  }
  async function storageImage(date: string, time: string, images: any) {
    console.log('running storage image function');
    setConsoleState('running storage image function');
    const storageRef = ref(storage, `Result/${date}/${time}.jpg`);
    try {
      uploadBytes(storageRef, images, {
        contentType: 'image/jpeg',
      })
        .finally(() => {
          console.log('uploading.....');
          setConsoleState('image uploading......');
        })
        .then(async snapshot => {
          console.log('image upload successfully');
          setConsoleState('image upload success');
        });
    } catch (error) {
      console.log(error);
      setConsoleState('image upload not success');
    }
  }
  async function submitImage(date: string, time: string, dataImage: any) {
    //get predict first
    const data = new FormData();
    let file = {
      uri: `data:image/jpeg;base64,${dataImage}`,
      type: 'multipart/form-data',
      name: 'photo.jpg',
    };
    data.append('file', file);
    console.log(data);
    await fetchData(data, date, time);
  }
  async function fetchData(data: any, date: string, time: string) {
    console.log('running predict function');
    setConsoleState('running predict function');
    await axios
      .post('https://roastcoffee-lueauo7kvq-uc.a.run.app/predict', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000,
      })
      .finally(() => {
        console.log('masih loading....');
        setConsoleState('predict running......');
      })
      .then(async res => {
        //handle success
        const temp = res.data;
        setConfidence(temp.class_percentages);
        setPredict(temp.predicted_class);
        console.log(temp);
        setConsoleState('predict success');
        setCheck('Predict Ok');
        await uploadDatabaseImage(date, time, temp);
        sendStopdata(temp.predicted_class);
        const cacheDirectory = fs.dirs.CacheDir;
        const filePath = `${cacheDirectory}/${date}${time}`;

        const imageData = {
          image: image,
          metadata: {temp},
        };
        await fs
          .writeFile(filePath, JSON.stringify(imageData), 'utf8')
          .then(() => {
            console.log('save photo');
          });
      })
      .catch(async e => {
        setConsoleState('predict error');
        setCheck('Predict not Ok');
        //handle error
        if (e.code === 'ECONNABORTED') {
          console.log('Request timed out');
          setConsoleState('Request timed out');
        } else {
          console.log(e.message);
        }
      });
  }

  async function getEncrypted(date: string, time: string) {
    console.log('running get Encrypted function');
    setConsoleState('running encrypted function');
    await axios({
      method: 'GET',
      url: `${textUri2}/encrypted`,
      timeout: 15000,
    })
      .then(res => {
        const bse64 = res.data;
        setCount(count + 1);
        setImage(bse64);

        getCapture(date, time, bse64);
      })
      .catch(async err => {
        console.log(err);
        setCheck('Encrypted Error');
        setLoading(false);
        setCount2(count2 + 1);
        console.log(`sekarang perhitungan ke ${count2}`);
        const cacheDirectory = fs.dirs.CacheDir;
        const filePath = `${cacheDirectory}/${date}${time}.json`;
        const temp = {
          predicted_class: 'coba',
          class_percentages: {
            Dark: 0,
            Green: 0,
            Light: 0,
            Medium: 0,
          },
        };
        const imageData = {
          image: image,
          metadata: {temp},
        };
        await fs
          .writeFile(filePath, JSON.stringify(imageData), 'utf8')
          .then(() => {
            console.log('save photo');
          });
      });
  }
  async function getTemp(date: string, time: string) {
    return await axios({
      method: 'GET',
      url: `${textUri}/temperature`,
    })
      .then(async res => {
        if (res.data.status === 'Off') {
          setStart(false);
        } else {
          console.log(res.data);
          let data = {x: res.data.waktu / 60, y: res.data.temperature};
          setSuhu(res.data.temperature);
          setTimer(res.data.waktu);
          setGrap([...grap, data]);
          await uploadDatabaseSuhu(date, time, data);
        }
        console.log(grap);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async function getCapture(date: string, time: string, bse64: any) {
    console.log('running get capture function');
    setConsoleState('captured');
    await axios({
      method: 'GET',
      url: `${textUri2}/capture`,
      timeout: 15000,
    })
      .then(async res => {
        submitImage(date, time, bse64);
        console.log(res.data);
      })
      .catch(e => {
        console.log('capture Error' + e);
        setCount2(count2 + 1);
        console.log(`sekarang perhitungan ke ${count2}`);
      });
  }
  async function sendStopdata(data: any) {
    if (data === selectedId) {
      roastingAutoStop();
    }
  }
  async function roastingStart() {
    setIsRunning(true);
    let body = {
      roasting: roasting,
      feeder: feeding,
      output: output,
      cooler: cooling,
    };
    setGrap([{x: 0, y: 0}]);
    axios
      .post(`${textUri}/roasting/start`, body)
      .then(res => {
        console.log(res.data);
        setStart(true);
        setKompor(false);
      })
      .catch(e => {
        console.log(e);
      });
  }
  const roastingStop = () => {
    setIsRunning(false);
    setKompor(false);
    axios
      .get(`${textUri}/roasting/stop`)
      .then(res => setStart(false))
      .catch(e => {
        console.log(e);
      });
  };
  const roastingAutoStop = () => {
    setKompor(false);
    axios
      .get(`${textUri}/roasting/autostop`)
      .then(res => {
        setStart(false);
        setRunningStatus(false);
        setIsRunning(false);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const checkPredict = () => {
    setLoading(true);
    const date = new Date().toDateString();
    const time = new Date().toTimeString();
    getEncrypted(date, time);
  };
  const checkConnect = (url: string) => {
    if (condition === 'default') {
      axios
        .get(`${url}`, {timeout: 10000})
        .then(res => {
          setCondition('true');
        })
        .catch(e => {
          setCondition('false');
          console.log('gagal');
        });
    } else {
      setCondition('default');
    }
  };
  const checkConnectCam = (url: string) => {
    if (condition2 === 'default') {
      axios
        .get(`${url}`, {timeout: 10000})
        .then(res => {
          setCondition2('true');
        })
        .catch(e => {
          setCondition2('false');
          console.log('gagal');
        });
    } else {
      setCondition2('default');
    }
  };
  const checkConnectColor = () => {
    if (condition === 'default') {
      return styles.defaultButton;
    } else if (condition === 'true') {
      return styles.trueButton;
    } else {
      return styles.falseButton;
    }
  };
  const checkConnectColorCam = () => {
    if (condition2 === 'default') {
      return styles.defaultButton;
    } else if (condition2 === 'true') {
      return styles.trueButton;
    } else {
      return styles.falseButton;
    }
  };
  const checkConnectColorPredict = () => {
    if (check === 'Url Predict Unchecked') {
      return styles.defaultButton;
    } else if (check === 'Predict Ok') {
      return styles.trueButton;
    } else {
      return styles.falseButton;
    }
  };
  async function suhuSekarang(url: string) {
    await axios
      .get(`${url}/temperature`, {timeout: 15000})
      .then(async res => {
        setSuhuRec(res.data.temperature);
        setCount(count + 1);
        const date = new Date().toDateString();
        const time = new Date().toTimeString();
        const data = {x: res.data.temperature, y: stopwatch};
        await uploadDatabaseSuhu(date, time, data);
      })
      .catch(e => {
        setSuhuRec(e);
      });
  }
  useEffect(() => {
    let intervalId: any;

    if (isRunning) {
      intervalId = setInterval(() => {
        setStopwatch(stopwatch + 1);
      }, 1000); // Update the timer every 1 second
    } else {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId); // Cleanup the interval when the component unmounts
    };
  }, [isRunning, stopwatch]);
  useEffect(() => {
    setTimeout(() => {
      if (kompor) {
        suhuSekarang(textUri);
      } else {
        setCount(0);
      }
    }, 15000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kompor, count]);
  useEffect(() => {
    setTimeout(() => {
      if (start) {
        running();
      } else {
        console.log('startnya dimatiin woy tolong');
        setConsoleState('mesin belum dinyalakan/berhenti');
      }
    }, 15000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count2, start]);
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <View style={styles.container}>
        <Text style={styles.header}>Roasting Coffee App</Text>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => {
            console.log('database');
            const date = dateURL;
            console.log(date);
            props.navigation.navigate('ListView', {data: date});
          }}>
          <Icon name="history" size={30} color="brown" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.column}>
          <Text style={styles.header2}>Control Url: </Text>
          <TextInput
            style={styles.input}
            onChangeText={setTextUri}
            value={textUri}
          />
          <View style={styles.column}>
            <TouchableOpacity
              style={[styles.btn_check, checkConnectColor()]}
              onPress={() => {
                const controlEsp = textUri;
                checkConnect(controlEsp);
              }}>
              <Text style={styles.text}>check connect</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.header2}>ESPCAM Url: </Text>
          <TextInput
            style={styles.input}
            onChangeText={setTextUri2}
            value={textUri2}
          />
          <View style={styles.column}>
            <TouchableOpacity
              style={[styles.btn_check, checkConnectColorCam()]}
              onPress={() => {
                const espCam = textUri2;
                checkConnectCam(espCam);
              }}>
              <Text style={styles.text}>check connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 60}}
          style={styles.backgroundStyle}>
          <View style={styles.container}>
            <TouchableOpacity
              style={[styles.btn_check, checkConnectColorPredict()]}
              onPress={() => {
                checkPredict();
              }}>
              <View>
                {loading ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  <Text style={styles.text}>check Predict Url</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn_check,
                kompor ? styles.trueButton : styles.defaultButton,
              ]}
              onPress={() => {
                setKompor(true);
              }}>
              <Text style={styles.text}>Kompor</Text>
            </TouchableOpacity>
          </View>
          <ChartRes getData={grap} />
          <TempandTime suhu={suhuRec} timer={stopwatch} />
          <TubeRotation url={textUri} />
          <View>
            <View>
              <Text style={[styles.text2, {marginVertical: 7}]}>
                Roasting level : {selectedId}
              </Text>
              <View style={styles.container}>
                <Button
                  onPress={() => {
                    setRoasting('60');
                    setSelectedId('Light');
                    setRoastingVisible(false);
                  }}
                  title="Light"
                  color={selectedId === 'Light' ? 'green' : '#D2691E'}
                  accessibilityLabel="Learn more about this purple button"
                />
                <Button
                  onPress={() => {
                    setRoasting('120');
                    setSelectedId('Medium');
                    setRoastingVisible(false);
                  }}
                  title="Medium"
                  color={selectedId === 'Medium' ? 'green' : '#D2691E'}
                  accessibilityLabel="Learn more about this purple button"
                />
                <Button
                  onPress={() => {
                    setRoasting('180');
                    setSelectedId('Dark');
                    setRoastingVisible(false);
                  }}
                  title="Dark"
                  color={selectedId === 'Dark' ? 'green' : '#D2691E'}
                  accessibilityLabel="Learn more about this purple button"
                />
                <Button
                  onPress={() => {
                    setRoastingVisible(!roastingVisible);
                    setSelectedId('Manual');
                  }}
                  title="Manual"
                  color={selectedId === 'Manual' ? 'green' : '#D2691E'}
                  accessibilityLabel="Learn more about this purple button"
                />
              </View>
            </View>

            {roastingVisible && (
              <View>
                <Text style={styles.textStatus}>Roasting</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setRoasting}
                  value={roasting}
                  keyboardType="number-pad"
                />
              </View>
            )}
            <View>
              <Text style={styles.textStatus}> Output</Text>
              <TextInput
                style={styles.input}
                onChangeText={setOutput}
                value={output}
                keyboardType="number-pad"
              />
            </View>
            <View>
              <Text style={styles.textStatus}> Cooling</Text>
              <TextInput
                style={styles.input}
                onChangeText={setCooling}
                value={cooling}
                keyboardType="number-pad"
              />
            </View>
            <View>
              <Text style={styles.textStatus}> Feeding</Text>
              <TextInput
                style={styles.input}
                onChangeText={setFeeding}
                value={feeding}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.btnon}
                onPress={() => {
                  roastingStart();
                  setRunningStatus(true);
                  setStopwatch(0);
                }}>
                <Text style={styles.text}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnoff}
                onPress={() => {
                  roastingStop();
                  setRunningStatus(false);
                }}>
                <Text style={styles.text}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
          {runningStatus ? (
            <View>
              <Text style={{color: 'red', fontSize: 16, textAlign: 'center'}}>
                Mesin Sedang berjalan
              </Text>
              <Text style={styles.text2}> {consoleState}</Text>
            </View>
          ) : (
            <Text style={styles.text2}> {consoleState}</Text>
          )}
          <View>
            <Text style={styles.textStatus}>{predict}</Text>
            <View style={styles.container}>
              <Text style={styles.textStatus}>
                {'Green: ' + JSON.stringify(confidence.Green)}
              </Text>
              <Text style={styles.textStatus}>
                {'Light: ' + JSON.stringify(confidence.Light)}
              </Text>
              <Text style={styles.textStatus}>
                {'Medium: ' + JSON.stringify(confidence.Medium)}
              </Text>
              <Text style={styles.textStatus}>
                {'Dark: ' + JSON.stringify(confidence.Dark)}
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{
                uri: `data:image/jpg;base64,${image}`,
              }}
              style={styles.img}
              onError={() => setImageVisible(false)}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
  header: {
    fontSize: 32,
    textAlign: 'left',
    color: 'black',
  },
  header2: {
    fontSize: 20,
    margin: 10,
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#D2691E',
    borderRadius: 10,
    alignItems: 'center',
    width: 220,
    padding: 10,
    marginVertical: 10,
  },
  btn_check: {
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
    padding: 10,
    marginVertical: 10,
  },
  btnon: {
    backgroundColor: 'green',
    borderRadius: 20,
    alignItems: 'center',
    width: 200,
    padding: 10,
    margin: 10,
  },
  btnoff: {
    backgroundColor: 'red',
    borderRadius: 20,
    alignItems: 'center',
    width: 200,
    padding: 10,
    margin: 10,
  },
  img: {
    alignItems: 'center',
    backgroundColor: 'purple',
    width: 400,
    height: 400,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  text2: {
    color: 'black',
    textAlign: 'center',
  },
  input: {
    color: 'black',
    height: 40,
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
    borderBottomColor: '#D2691E',
    borderBottomWidth: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 205,
  },
  textStatus: {
    color: 'black',
    fontSize: 16,
    margin: 5,
  },
  backgroundStyle: {
    backgroundColor: 'white',
    flex: 1,
  },
  defaultButton: {
    backgroundColor: '#D2691E',
  },
  trueButton: {
    backgroundColor: 'green',
  },
  falseButton: {
    backgroundColor: 'red',
  },
});

export default BaseView;

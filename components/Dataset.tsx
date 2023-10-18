/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import storage from './config';
import {ref, uploadBytes} from 'firebase/storage';
import {decode} from 'base-64';

function Dataset() {
  if (typeof atob === 'undefined') {
    global.atob = decode;
  }
  const [saved, setSaved] = useState('');
  const [textUri2, setTextUri2] = useState('http://192.168.199.12');

  async function running() {
    const date = new Date().toDateString();
    const time = new Date().toTimeString();
    const gambar = await fetch(`${textUri2}/saved-photo`);
    getEncrypted();
    await storageImage(date, time, await gambar.blob());
  }
  async function getEncrypted() {
    console.log('running get Encrypted function');
    axios({
      method: 'GET',
      url: `http://${textUri2}/encrypted`,
    })
      .then(res => {
        const bse64 = res.data;
        setSaved(bse64);
        getCapture();
      })
      .catch(err => {
        console.log(err);
      });
  }
  async function getCapture() {
    console.log('running get capture function');
    await axios({
      method: 'GET',
      url: `http://${textUri2}/capture`,
    }).then(async res => {
      console.log(res.data);
    });
  }
  async function storageImage(date: string, time: string, images: any) {
    console.log('running storage image function');
    const storageRef = ref(storage, `Dataset/${date}/${time}.jpg`);
    try {
      uploadBytes(storageRef, images, {
        contentType: 'image/jpeg',
      })
        .finally(() => {
          console.log('uploading.....');
        })
        .then(() => {
          console.log('Uploaded photo successfully');
          Alert.alert('Storage', 'Storage Success', [
            {
              text: 'Ok',
              onPress: () => console.log('Storage Successfully'),
            },
          ]);
        });
    } catch (error) {
      console.log(error);
      Alert.alert('Storage', 'Storage Error', [
        {
          text: 'Ok',
          onPress: () => console.log('Storage Error'),
        },
      ]);
    }
  }

  return (
    <SafeAreaView>
      <View style={{alignItems: 'center'}}>
        <View style={styles.column}>
          <Text style={styles.header2}>ESPCAM Url: </Text>
          <TextInput
            style={styles.input}
            onChangeText={setTextUri2}
            value={textUri2}
          />
          <View style={styles.column}>
            <TouchableOpacity
              style={styles.btn_check2}
              onPress={() => {
                axios({
                  method: 'GET',
                  url: `${textUri2}/capture`,
                }).then(async res => {
                  console.log(res);
                  Alert.alert('ESPCAM', 'ESP CAM captured', [
                    {
                      text: 'Ok',
                      onPress: () => console.log('Control not Connected'),
                    },
                  ]);
                });
              }}>
              <Text style={styles.text}>check connect</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image
          source={{
            uri: `data:image/jpg;base64,${saved}`,
          }}
          style={styles.img}
        />
        <TouchableOpacity
          onPress={() => {
            running();

            console.log('tertekan');
          }}
          style={styles.btn}>
          <Text style={styles.text}>Capture photo </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    width: 220,
    padding: 10,
    marginVertical: 10,
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 205,
  },
  input: {
    height: 40,
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
    borderBottomColor: 'purple',
    borderBottomWidth: 2,
  },
  header2: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_check2: {
    backgroundColor: '#687A86',
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
    padding: 10,
    marginVertical: 10,
  },
});

export default Dataset;

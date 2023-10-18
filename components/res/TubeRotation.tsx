import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
function TubeRotation(props: any) {
  const [status, setStatus] = useState(' ');
  const url = props.url;
  const tubeon = () => {
    axios
      .get(`${url}/tubeon`)
      .then(res => {
        console.log(res);
        setStatus('ON');
      })
      .catch(() => {
        console.log('ON');
      });
  };
  const tubeoff = () => {
    axios
      .get(`${url}/tubeoff`)
      .then(res => {
        console.log(res);
        setStatus('OFF');
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <View>
      <Text style={styles.Text}>Tube Rotation Status : {status} </Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.btnon} onPress={tubeon}>
          <Text>ON</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnoff} onPress={tubeoff}>
          <Text>OFF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  Text: {
    fontSize: 16,
    margin: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
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
});
export default TubeRotation;

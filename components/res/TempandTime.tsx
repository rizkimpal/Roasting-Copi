/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
function TempandTime(props: any) {
  const formatTime = () => {
    const minutes = Math.floor(props.timer / 60);
    const seconds = props.timer % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };
  return (
    <View style={styles.Container}>
      <View style={styles.content}>
        <Text style={styles.text}>Suhu Sekarang </Text>
        <Text style={styles.text}>{`${props.suhu}℃`}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Waktu Sekarang</Text>
        <Text style={styles.text}>{formatTime()}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 205,
    borderWidth: 1,
    backgroundColor: 'lightgrey',
  },
  text: {
    color: 'black',
    margin: 5,
  },
});

export default TempandTime;

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Utils
import {backgroundColor, white} from '../Utils/colors';

function Button({onPress, title}) {
  return (
    <View style={styles.centerContents}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={{color: white}}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 50,
    backgroundColor,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: white,
    justifyContent: 'center',
    padding: 10,
  },
  centerContents: {
    alignItems: 'center',
    backgroundColor,
    justifyContent: 'center',
    height: 100,
  },
});

export default Button;

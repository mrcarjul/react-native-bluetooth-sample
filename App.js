import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

// Screens
import CodeReaderScreen from './src/Screens/CodeReaderScreen';
import BluetoothScreen from './src/Screens/BluetoothScreen';

// Components
import Button from './src/Components/Button';

// Utils
import {backgroundColor, white} from './src/Utils/colors';

const App = () => {
  const [screen, setScreen] = useState(true);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Button onPress={() => setScreen(!screen)} title="Switch Screen" />
        {screen ? <CodeReaderScreen /> : <BluetoothScreen />}
      </SafeAreaView>
    </>
  );
};

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
  container: {
    flex: 1,
  },
});

export default App;

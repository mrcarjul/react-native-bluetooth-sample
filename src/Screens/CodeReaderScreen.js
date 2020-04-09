import React from 'react';

// Core Components
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

// Utils
import {backgroundColor, white} from '../Utils/colors';

const {width, height} = Dimensions.get('window');

class CodeReaderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratioInDec: 1.77,
      type: RNCamera.Constants.Type.back,
      barcodeFinderVisible: true,
      loading: true,
      payload: null,
    };
  }

  /**
   * @description evaluate data obtained by qrcode and give it the proper format
   * @param {String} data
   */
  onReviewQRCode = data => {
    /*
     * example of data recived by scanning aqr code from amazon plug
     * "ABV:IB01;PID:ebK3;PUK:MDkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDIgACcQ0JiaZzVKrdzKISuBnsSHbioyE9Jo2tUfQdE1gFcGE=;PIN:D380C08FA"
     * const splittedData = data.split(';');
     * const oArray = splittedData.map(item => {
     * const prop = item.split(':')[0];
     * return {[prop]: item.split(':')[1]};
     * });
     * oArray in this case ends with this format
     * [
     *  {ABV: "IB01"}
     *  {PID: "ebK3"}
     *  {PUK: "MDkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDIgACcQ0JiaZzVKrdzKISuBnsSHbioyE9Jo2tUfQdE1gFcGE="}
     *  {PIN: "D380C08FA"}
     * ]
     */
    const splittedData = data.split(';');
    const oArray = splittedData.map(item => {
      const prop = item.split(':')[0];
      return {[prop]: item.split(':')[1]};
    });
    // oArray in this case ends with this format
    /*
    [
     {ABV: "IB01"}
     {PID: "ebK3"}
     {PUK: "MDkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDIgACcQ0JiaZzVKrdzKISuBnsSHbioyE9Jo2tUfQdE1gFcGE="}
     {PIN: "D380C08FA"}
    ]
    return oArray;
    */
    return oArray;
  };

  /**
   * Scans QR code
   */
  _handleBarCodeScan = async ({type, data}) => {
    console.log(
      'CodeReader - _handleBarCodeScan - Scan successful: ' +
        JSON.stringify(data),
    );
    const payload = this.onReviewQRCode(data);
    this.setState({
      loading: true,
      payload,
    });
  };

  renderCamera = () => {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        barcodeFinderVisible={this.state.barcodeFinderVisible}
        barcodeFinderWidth={280}
        barcodeFinderHeight={220}
        barcodeFinderBorderColor="white"
        barcodeFinderBorderWidth={2}
        captureAudio={false}
        defaultTouchToFocus
        mirrorImage={false}
        onBarCodeRead={this._handleBarCodeScan}
        onFocusChanged={() => {}}
        onZoomChanged={() => {}}
        style={styles.camera}
        type={this.state.type}
      />
    );
  };

  render() {
    return (
      <View style={styles.outerContainer}>
        <Text style={{color: white, textAlign: 'center'}}>
          CodeReaderScreen
        </Text>
        <View style={styles.container}>{this.renderCamera()}</View>
        <View style={styles.centerContents}>
          {this.state.payload && (
            <Text style={{color: white}}>
              {JSON.stringify(this.state.payload)}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    height: height / 3,
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContents: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: white,
    flex: 1,
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  outerContainer: {
    flex: 1,
    backgroundColor,
  },
  permissionsText: {
    color: white,
    textAlign: 'center',
  },
});

export default CodeReaderScreen;

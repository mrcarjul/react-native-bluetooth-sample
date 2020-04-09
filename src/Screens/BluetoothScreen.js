import React from 'react';

// Components
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../Components/Button';
import {BleManager} from 'react-native-ble-plx';

// Utils
import {backgroundColor, white} from '../Utils/colors';

const {width} = Dimensions.get('window');

class BluetoothScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canScan: false,
      isScanning: false,
      devices: [],
      devicesMeta: null,
    };
    this.manager = new BleManager();
  }

  /**
   * @description When iOS application launches BLE stack is not immediately available and we need to check its status.
   */
  componentDidMount = () => {
    this.subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.setState({canScan: true});
        this.subscription.remove();
      }
    }, true);
  };

  componentWillUnmount = () => {
    this.subscription.remove();
    this.manager.stopDeviceScan();
  };

  connectToDevice = dvc => {
    dvc
      .connect()
      .then(device => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        // Do work on device with services and characteristics
        this.setState({devices: [], devicesMeta: null, isScanning: false});
        this.manager.stopDeviceScan();
      })
      .catch(error => {
        // Handle errors
        this.setState({devices: [], devicesMeta: null, isScanning: false});
        this.manager.stopDeviceScan();
      });
  };

  /**
   * @description Devices needs to be scanned first to be able to connect to them.
   */
  scanAndConnect = () => {
    this.setState({devices: [], devicesMeta: null, isScanning: false});
    if (this.state.canScan) {
      // startDeviceScan(UUIDs: Array<UUID>?, options: ScanOptions?, listener: function (error: BleError?, scannedDevice: Device?))
      /**
       * UUIDs (Array<UUID>?) Array of strings containing UUID s of Service s which are registered in scanned Device . If null is passed, all available Device s will be scanned.
       * options (ScanOptions?) Optional configuration for scanning operation.
       * listener (function (error: BleError?, scannedDevice: Device?))
       */
      this.setState({isScanning: true});
      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          // Handle error (scanning will be stopped automatically)
          this.setState({isScanning: false});
          return;
        }
        const devicesMeta = this.state.devicesMeta
          ? this.state.devicesMeta
          : [];
        const devices = [...this.state.devices];
        devices.push({device});
        debugger;
        this.setState({
          devicesMeta: [...devicesMeta, {name: device.name, id: device.id}],
          devices,
        });
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (
          device.isConnectable &&
          (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag')
        ) {
          // Stop scanning as it's not necessary if you are scanning for one device.
          this.connectToDevice(device);
          // Proceed with connection.
        }
      });
    }
  };

  render() {
    return (
      <View style={styles.outerContainer}>
        <Text style={styles.textNormal}>BluetoothScreen</Text>
        <Button title="Scan Devices" onPress={this.scanAndConnect} />
        <View style={styles.centerContents}>
          {this.state.devicesMeta &&
            this.state.devicesMeta.map((device, idx) => (
              <View key={idx} style={styles.row}>
                <Text style={[styles.textNormal, styles.textContent]}>
                  name: {device.name ? device.name : 'Unknown'} id: {device.id}
                </Text>
                <Button
                  title="Connect"
                  onPress={() =>
                    this.connectToDevice(this.state.devices[idx].device)
                  }
                />
              </View>
            ))}
          {this.state.isScanning && (
            <ActivityIndicator size="small" color={white} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  textContent: {
    height: 'auto',
    flexWrap: 'wrap',
    marginRight: 10,
    width: width * 0.6,
  },
  row: {
    alignItems: 'center',
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  textNormal: {
    color: white,
    textAlign: 'center',
  },
  outerContainer: {
    flex: 1,
    backgroundColor,
  },
});

export default BluetoothScreen;

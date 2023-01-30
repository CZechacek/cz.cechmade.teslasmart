'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class TAHSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    this.enableDebug();

    // Enables debug logging in zigbee-clusters
    debug(true);

    // print the node's info to the console
    this.printNode();

    // Register measure_battery capability and configure attribute reporting
    this.batteryThreshold = 20;
    this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
      getOpts: {
        getOnStart: true,
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0, // No minimum reporting interval
          maxInterval: 60000, // Maximally every ~16 hours
          minChange: 5, // Report when value changed by 5
        },
      },
    });

    this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 6000, // Minimum reporting interval every ~2 hours
          maxInterval: 60000, // Maximally every ~16 hours
          minChange: 1, // Report when value changed by 1
        },
      },
    });

    zclNode.endpoints[1].clusters[CLUSTER.TEMPERATURE_MEASUREMENT.NAME]
      .on('attr.measuredValue', this.onTemperatureMeasuredAttributeReport.bind(this));

    zclNode.endpoints[1].clusters[CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT.NAME]
      .on('attr.measuredValue', this.onRelativeHumidityMeasuredAttributeReport.bind(this));
  }

  onTemperatureMeasuredAttributeReport(measuredValue) {
    const temperatureOffset = this.getSetting('temperature_offset') || 0;
    const parsedValue = this.getSetting('temperature_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
    if (parsedValue >= -65 && parsedValue <= 65) {
      this.log('measure_temperature | msTemperatureMeasurement - measuredValue (temperature):', parsedValue, '+ temperature offset', temperatureOffset);
      this.setCapabilityValue('measure_temperature', parsedValue + temperatureOffset).catch(this.error);
    }
  }

  onRelativeHumidityMeasuredAttributeReport(measuredValue) {
    const humidityOffset = this.getSetting('humidity_offset') || 0;
    const parsedValue = this.getSetting('humidity_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
    if (parsedValue >= 0 && parsedValue <= 100) {
      this.log('measure_humidity | msRelativeHumidity - measuredValue (humidity):', parsedValue, '+ humidity offset', humidityOffset);
      this.setCapabilityValue('measure_humidity', parsedValue + humidityOffset).catch(this.error);
    }
  }

  async onDeleted() {
    this.log('Temperature and Humidity Sensor removed');
  }

}

module.exports = TAHSensor;


// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] ZigBeeDevice has been initialized { firstInit: false, isSubDevice: false }
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] ------------------------------------------
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] Node: 80af6686-b784-4fc7-9128-a455cd05bd08
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] - Receive when idle: false
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] - Endpoints: 1
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] -- Clusters:
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] --- basic
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] --- powerConfiguration
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] --- temperatureMeasurement
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] --- relativeHumidity
// [log] 2023-01-21 19:45:53 [ManagerDrivers] [Driver:temperature-and-humidity-sensor] [Device:069f7dd5-a53b-440f-963f-67f69162204c] ------------------------------------------
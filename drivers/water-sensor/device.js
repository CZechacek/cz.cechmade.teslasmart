'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class WaterSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    this.enableDebug();

    // Enables debug logging in zigbee-clusters
    debug(true);

    // print the node's info to the console
    this.printNode();

    zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = (payload) => {
      this.onIASZoneStatusChangeNotification(payload);
    };

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
  }

  onIASZoneStatusChangeNotification({
    zoneStatus, extendedStatus, zoneId, delay,
  }) {
    this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
    this.setCapabilityValue('alarm_water', zoneStatus.alarm1).catch(this.error);
    // this.setCapabilityValue('alarm_battery', zoneStatus.battery).catch(this.error);
  }

  async onDeleted() {
    this.log('Water Sensor removed');
  }

}

module.exports = WaterSensor;

// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] ZigBeeDevice has been initialized { firstInit: true, isSubDevice: false }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] ------------------------------------------
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] Node: 3b20c914-20c5-4ed9-b15c-62d1d90199bd
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] - Receive when idle: false
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] - Endpoints: 1
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] -- Clusters:
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] --- basic
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] --- powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] --- iasZone
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] ------------------------------------------
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability alarm_battery with cluster powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] registered capability alarm_battery with cluster powerConfiguration, configuration: {
//   get: 'batteryPercentageRemaining',
//   getOpts: { getOnStart: true },
//   set: null,
//   report: 'batteryPercentageRemaining',
//   endpoint: 1,
//   reportParser: [Function: bound reportParser],
//   reportOpts: {
//     configureAttributeReporting: { minInterval: 0, maxInterval: 60000, minChange: 5 }
//   }
// }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability set, capability alarm_battery, cluster: powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability report, capability alarm_battery, cluster: powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] configure attribute reporting (endpoint: 1, cluster: powerConfiguration, attribute: batteryPercentageRemaining) { minInterval: 0, maxInterval: 60000, minChange: 5 }
// 2023-01-14T16:49:24.142Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) configure reporting [
//   {
//     direction: 'reported',
//     attributeId: 33,
//     attributeDataType: 32,
//     minInterval: 0,
//     maxInterval: 60000,
//     minChange: 5
//   }
// ]
// 2023-01-14T16:49:24.151Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.configureReporting { reports: [ [Object] ] },
//   cmdId: 6,
//   trxSequenceNumber: 1
// }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability get, capability alarm_battery, cluster: powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] get → alarm_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1)
// 2023-01-14T16:49:24.189Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) read attributes [ 33 ]
// 2023-01-14T16:49:24.194Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.readAttributes { attributes: [ 33 ] },
//   cmdId: 0,
//   trxSequenceNumber: 2
// }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] get → alarm_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1)
// 2023-01-14T16:49:24.207Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) read attributes [ 33 ]
// 2023-01-14T16:49:24.212Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.readAttributes { attributes: [ 33 ] },
//   cmdId: 0,
//   trxSequenceNumber: 3
// }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability measure_battery with cluster powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] registered capability measure_battery with cluster powerConfiguration, configuration: {
//   get: 'batteryPercentageRemaining',
//   getOpts: {},
//   set: null,
//   report: 'batteryPercentageRemaining',
//   endpoint: 1,
//   reportParser: [Function: bound reportParser],
//   reportOpts: {
//     configureAttributeReporting: { minInterval: 6000, maxInterval: 60000, minChange: 1 }
//   }
// }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability set, capability measure_battery, cluster: powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability report, capability measure_battery, cluster: powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] configure attribute reporting (endpoint: 1, cluster: powerConfiguration, attribute: batteryPercentageRemaining) { minInterval: 6000, maxInterval: 60000, minChange: 1 }
// 2023-01-14T16:49:24.246Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) configure reporting [
//   {
//     direction: 'reported',
//     attributeId: 33,
//     attributeDataType: 32,
//     minInterval: 6000,
//     maxInterval: 60000,
//     minChange: 1
//   }
// ]
// 2023-01-14T16:49:24.254Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.configureReporting { reports: [ [Object] ] },
//   cmdId: 6,
//   trxSequenceNumber: 4
// }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] register capability get, capability measure_battery, cluster: powerConfiguration
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] get → measure_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1)
// 2023-01-14T16:49:24.272Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) read attributes [ 33 ]
// 2023-01-14T16:49:24.278Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.readAttributes { attributes: [ 33 ] },
//   cmdId: 0,
//   trxSequenceNumber: 5
// }
// 2023-01-14T16:49:24.853Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame defaultResponse powerConfiguration.defaultResponse {
//   cmdId: 6,
//   status: 'UNSUP_GENERAL_COMMAND'
// }
// 2023-01-14T16:49:24.882Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame readAttributesStructured.response powerConfiguration.readAttributesStructured.response {
//   attributes: <Buffer 21 00 00 20 c8>
// }
// 2023-01-14T16:49:24.914Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame readAttributesStructured.response powerConfiguration.readAttributesStructured.response {
//   attributes: <Buffer 21 00 00 20 c8>
// }
// 2023-01-14T16:49:24.930Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) read attributes result { attributes: <Buffer 21 00 00 20 c8> }
// 2023-01-14T16:49:24.940Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) read attributes result { attributes: <Buffer 21 00 00 20 c8> }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] get → alarm_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1) → raw result: { batteryPercentageRemaining: 200 }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] handle report (cluster: powerConfiguration, capability: alarm_battery), raw payload: { batteryPercentageRemaining: 200 }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] get → alarm_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1) → raw result: { batteryPercentageRemaining: 200 }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] handle report (cluster: powerConfiguration, capability: alarm_battery), raw payload: { batteryPercentageRemaining: 200 }
// [log] 2023-01-14 16:49:24 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] handle report (cluster: powerConfiguration, capability: alarm_battery), parsed payload: false
// [log] 2023-01-14 16:49:25 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] handle report (cluster: powerConfiguration, capability: alarm_battery), parsed payload: false
// [log] 2023-01-14 16:49:25 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] get → alarm_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1) → parsed result false
// [log] 2023-01-14 16:49:25 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] get → alarm_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1) → parsed result false
// 2023-01-14T16:49:25.067Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) configure reporting [
//   {
//     direction: 'reported',
//     attributeId: 33,
//     attributeDataType: 32,
//     minInterval: 0,
//     maxInterval: 60000,
//     minChange: 5
//   }
// ]
// 2023-01-14T16:49:25.087Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.configureReporting { reports: [ [Object] ] },
//   cmdId: 6,
//   trxSequenceNumber: 6
// }
// 2023-01-14T16:49:26.361Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame defaultResponse powerConfiguration.defaultResponse {
//   cmdId: 6,
//   status: 'UNSUP_GENERAL_COMMAND'
// }
// 2023-01-14T16:49:26.366Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame readAttributesStructured.response powerConfiguration.readAttributesStructured.response {
//   attributes: <Buffer 21 00 00 20 c8>
// }
// 2023-01-14T16:49:26.372Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame defaultResponse powerConfiguration.defaultResponse {
//   cmdId: 6,
//   status: 'UNSUP_GENERAL_COMMAND'
// }
// 2023-01-14T16:49:26.374Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) read attributes result { attributes: <Buffer 21 00 00 20 c8> }
// [log] 2023-01-14 16:49:26 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] get → measure_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1) → raw result: { batteryPercentageRemaining: 200 }
// [log] 2023-01-14 16:49:26 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] [dbg] handle report (cluster: powerConfiguration, capability: measure_battery), raw payload: { batteryPercentageRemaining: 200 }
// [log] 2023-01-14 16:49:26 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] handle report (cluster: powerConfiguration, capability: measure_battery), parsed payload: 100
// [log] 2023-01-14 16:49:26 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] get → measure_battery → read attribute (cluster: powerConfiguration, attributeId: batteryPercentageRemaining, endpoint: 1) → parsed result 100
// 2023-01-14T16:49:26.383Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) configure reporting [
//   {
//     direction: 'reported',
//     attributeId: 33,
//     attributeDataType: 32,
//     minInterval: 6000,
//     maxInterval: 60000,
//     minChange: 1
//   }
// ]
// 2023-01-14T16:49:26.385Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.configureReporting { reports: [ [Object] ] },
//   cmdId: 6,
//   trxSequenceNumber: 7
// }
// 2023-01-14T16:49:26.391Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) configure reporting [
//   {
//     direction: 'reported',
//     attributeId: 33,
//     attributeDataType: 32,
//     minInterval: 0,
//     maxInterval: 60000,
//     minChange: 5
//   }
// ]
// 2023-01-14T16:49:26.393Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.configureReporting { reports: [ [Object] ] },
//   cmdId: 6,
//   trxSequenceNumber: 8
// }
// 2023-01-14T16:49:29.137Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame defaultResponse powerConfiguration.defaultResponse {
//   cmdId: 6,
//   status: 'UNSUP_GENERAL_COMMAND'
// }
// 2023-01-14T16:49:29.146Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame defaultResponse powerConfiguration.defaultResponse {
//   cmdId: 6,
//   status: 'UNSUP_GENERAL_COMMAND'
// }
// [err] 2023-01-14 16:49:29 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] Error: configuring attribute reporting (endpoint: 1, cluster: powerConfiguration) {
//   batteryPercentageRemaining: { minInterval: 0, maxInterval: 60000, minChange: 5 }
// } Error: UNSUP_GENERAL_COMMAND
//     at PowerConfigurationCluster.configureReporting (/node_modules/zigbee-clusters/lib/Cluster.js:1062:23)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async PowerConfigurationCluster.configureReporting (/node_modules/zigbee-clusters/lib/Cluster.js:511:27)
//     at async Promise.all (index 0)
// [err] 2023-01-14 16:49:29 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] Error: failed to configure reporting for alarm_battery and powerConfiguration Error: UNSUP_GENERAL_COMMAND
//     at PowerConfigurationCluster.configureReporting (/node_modules/zigbee-clusters/lib/Cluster.js:1062:23)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async PowerConfigurationCluster.configureReporting (/node_modules/zigbee-clusters/lib/Cluster.js:511:27)
//     at async Promise.all (index 0)
// 2023-01-14T16:49:29.171Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) configure reporting [
//   {
//     direction: 'reported',
//     attributeId: 33,
//     attributeDataType: 32,
//     minInterval: 6000,
//     maxInterval: 60000,
//     minChange: 1
//   }
// ]
// 2023-01-14T16:49:29.175Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) send frame ZCLStandardHeader {
//   frameControl: [],
//   data: powerConfiguration.configureReporting { reports: [ [Object] ] },
//   cmdId: 6,
//   trxSequenceNumber: 9
// }
// [err] 2023-01-14 16:49:54 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] Error: configuring attribute reporting (endpoint: 1, cluster: powerConfiguration) {
//   batteryPercentageRemaining: { minInterval: 6000, maxInterval: 60000, minChange: 1 }
// } Error: timeout
//     at Timeout._onTimeout (/node_modules/zigbee-clusters/lib/Cluster.js:927:16)
//     at listOnTimeout (node:internal/timers:559:17)
//     at processTimers (node:internal/timers:502:7)
// [err] 2023-01-14 16:49:54 [ManagerDrivers] [Driver:water-sensor] [Device:236395dc-36a0-416d-8592-d384a333044a] Error: failed to configure reporting for measure_battery and powerConfiguration Error: timeout
//     at Timeout._onTimeout (/node_modules/zigbee-clusters/lib/Cluster.js:927:16)
//     at listOnTimeout (node:internal/timers:559:17)
//     at processTimers (node:internal/timers:502:7)

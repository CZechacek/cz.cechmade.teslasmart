'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class SmokeSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

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
    this.setCapabilityValue('alarm_smoke', zoneStatus.alarm1).catch(this.error);
    this.setCapabilityValue('alarm_tamper', zoneStatus.tamper).catch(this.error);
    // this.setCapabilityValue('alarm_battery', zoneStatus.battery).catch(this.error);
  }

  async onDeleted() {
    this.log('Smoke Sensor removed');
  }

}

module.exports = SmokeSensor;

// [log] 2022-11-16 19:48:01 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] ZigBeeDevice has been initialized { firstInit: true, isSubDevice: false }
// [log] 2022-11-16 19:48:01 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] ------------------------------------------
// [log] 2022-11-16 19:48:01 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] Node: 05921d61-c504-4c18-8067-a852267c5187
// [log] 2022-11-16 19:48:01 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] - Receive when idle: false
// [log] 2022-11-16 19:48:01 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] - Endpoints: 1
// [log] 2022-11-16 19:48:01 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] -- Clusters:
// [log] 2022-11-16 19:48:01 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] --- basic
// [log] 2022-11-16 19:48:02 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] --- powerConfiguration
// [log] 2022-11-16 19:48:02 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] --- iasZone
// [log] 2022-11-16 19:48:02 [ManagerDrivers] [Driver:smoke-sensor] [Device:58f8ec56-a451-4264-94b2-56d467071020] ------------------------------------------
// 2022-11-16T19:48:02.096Z zigbee-clusters:cluster ep: 1, cl: basic (0) received frame reportAttributes basic.reportAttributes { attributes: <Buffer 01 00 20 42> }
// 2022-11-16T19:48:28.351Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame reportAttributes powerConfiguration.reportAttributes {
//   attributes: <Buffer 21 00 20 c8>

// [log] 2022-11-20 08:49:00 [TeslaSmartApp] TeslaSmartApp has been initialized
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] ZigBeeDevice has been initialized { firstInit: true, isSubDevice: false }
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] ------------------------------------------
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] Node: 2dcd84c9-3522-4724-88a5-55a87e1b24df
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] - Receive when idle: false
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] - Endpoints: 1
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] -- Clusters:
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] --- basic
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] --- powerConfiguration
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] --- iasZone
// [log] 2022-11-20 08:49:28 [ManagerDrivers] [Driver:smoke-sensor] [Device:0eeadd75-607b-43c4-bb37-64f55845b763] ------------------------------------------
// 2022-11-20T08:49:54.642Z zigbee-clusters:cluster ep: 1, cl: powerConfiguration (1) received frame reportAttributes powerConfiguration.reportAttributes {
//   attributes: <Buffer 21 00 20 c8>
// }
// 2022-11-20T08:51:42.159Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) received frame zoneStatusChangeNotification iasZone.zoneStatusChangeNotification {
//   zoneStatus: Bitmap [ tamper ],
//   extendedStatus: 0,
//   zoneId: 255,
//   delay: 0
// }
// 2022-11-20T08:51:42.163Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) unknown command received: ZCLStandardHeader {
//   frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//   trxSequenceNumber: 9,
//   cmdId: 0,
//   data: <Buffer 04 00 00 ff 00 00>
// } { transId: 0, linkQuality: 0, dstEndpoint: 1, timestamp: 12799599 }
// 2022-11-20T08:51:42.173Z zigbee-clusters:endpoint ep: 1, cl: iasZone (1280), error while handling frame unknown_command_received {
//   meta: { transId: 0, linkQuality: 0, dstEndpoint: 1, timestamp: 12799599 },
//   frame: ZCLStandardHeader {
//     frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//     trxSequenceNumber: 9,
//     cmdId: 0,
//     data: <Buffer 04 00 00 ff 00 00>
//   }
// }
// 2022-11-20T08:51:43.885Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) received frame zoneStatusChangeNotification iasZone.zoneStatusChangeNotification {
//   zoneStatus: Bitmap [  ],
//   extendedStatus: 0,
//   zoneId: 255,
//   delay: 0
// }
// 2022-11-20T08:51:43.887Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) unknown command received: ZCLStandardHeader {
//   frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//   trxSequenceNumber: 10,
//   cmdId: 0,
//   data: <Buffer 00 00 00 ff 00 00>
// } { transId: 0, linkQuality: 5, dstEndpoint: 1, timestamp: 12805008 }
// 2022-11-20T08:51:43.893Z zigbee-clusters:endpoint ep: 1, cl: iasZone (1280), error while handling frame unknown_command_received {
//   meta: { transId: 0, linkQuality: 5, dstEndpoint: 1, timestamp: 12805008 },
//   frame: ZCLStandardHeader {
//     frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//     trxSequenceNumber: 10,
//     cmdId: 0,
//     data: <Buffer 00 00 00 ff 00 00>
//   }
// }
// 2022-11-20T08:53:31.638Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) received frame zoneStatusChangeNotification iasZone.zoneStatusChangeNotification {
//   zoneStatus: Bitmap [ alarm1 ],
//   extendedStatus: 0,
//   zoneId: 255,
//   delay: 0
// }
// 2022-11-20T08:53:31.639Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) unknown command received: ZCLStandardHeader {
//   frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//   trxSequenceNumber: 11,
//   cmdId: 0,
//   data: <Buffer 01 00 00 ff 00 00>
// } { transId: 0, linkQuality: 26, dstEndpoint: 1, timestamp: 13141742 }
// 2022-11-20T08:53:31.645Z zigbee-clusters:endpoint ep: 1, cl: iasZone (1280), error while handling frame unknown_command_received {
//   meta: { transId: 0, linkQuality: 26, dstEndpoint: 1, timestamp: 13141742 },
//   frame: ZCLStandardHeader {
//     frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//     trxSequenceNumber: 11,
//     cmdId: 0,
//     data: <Buffer 01 00 00 ff 00 00>
//   }
// }
// 2022-11-20T08:53:33.614Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) received frame zoneStatusChangeNotification iasZone.zoneStatusChangeNotification {
//   zoneStatus: Bitmap [  ],
//   extendedStatus: 0,
//   zoneId: 255,
//   delay: 0
// }
// 2022-11-20T08:53:33.617Z zigbee-clusters:cluster ep: 1, cl: iasZone (1280) unknown command received: ZCLStandardHeader {
//   frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//   trxSequenceNumber: 12,
//   cmdId: 0,
//   data: <Buffer 00 00 00 ff 00 00>
// } { transId: 0, linkQuality: 0, dstEndpoint: 1, timestamp: 13147913 }
// 2022-11-20T08:53:33.620Z zigbee-clusters:endpoint ep: 1, cl: iasZone (1280), error while handling frame unknown_command_received {
//   meta: { transId: 0, linkQuality: 0, dstEndpoint: 1, timestamp: 13147913 },
//   frame: ZCLStandardHeader {
//     frameControl: Bitmap [ clusterSpecific, directionToClient, disableDefaultResponse ],
//     trxSequenceNumber: 12,
//     cmdId: 0,
//     data: <Buffer 00 00 00 ff 00 00>
//   }
// }

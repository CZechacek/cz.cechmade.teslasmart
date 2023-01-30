'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class MotionSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    this.enableDebug();

    // Enables debug logging in zigbee-clusters
    debug(true);

    // print the node's info to the console
    this.printNode();

    // zclNode.endpoints[1].clusters[CLUSTER.OCCUPANCY_SENSING.NAME]
    //   .on('attr.occupancy', this.onOccupancyAttributeReport.bind(this));

    // zclNode.endpoints[1].clusters[CLUSTER.ILLUMINANCE_MEASUREMENT.NAME]
    //   .on('attr.measuredValue', this.onLuminanceMeasuredValueAttributeReport.bind(this));

    zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = (payload) => {
      this.onIASZoneStatusChangeNotification(payload);
    };
  }

  onIASZoneStatusChangeNotification({
    zoneStatus, extendedStatus, zoneId, delay,
  }) {
    this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
    this.setCapabilityValue('alarm_motion', zoneStatus.alarm1).catch(this.error);
    // // Set and clear motion timeout
    // const alarmMotionResetWindow = this.getSetting('hacked_alarm_motion_reset_window') ? 5 : (this.getSetting('alarm_motion_reset_window') || 300);
    // // Set a timeout after which the alarm_motion capability is reset
    // if (this.motionAlarmTimeout) clearTimeout(this.motionAlarmTimeout);

    // this.motionAlarmTimeout = setTimeout(() => {
    //   this.log('manual alarm_motion reset');
    //   this.setCapabilityValue('alarm_motion', false).catch(this.error);
    // }, alarmMotionResetWindow * 1000);

    this.setCapabilityValue('alarm_battery', zoneStatus.battery).catch(this.error);
  }

  // onOccupancyAttributeReport({ occupied }) {
  //   this.log('handle report (cluster: OccupancySensing, attribute: occupancy, capability: alarm_motion), parsed payload:', occupied);

  //   this.setCapabilityValue('alarm_motion', occupied).catch(this.error);

  //   // Set and clear motion timeout
  //   const alarmMotionResetWindow = this.getSetting('hacked_alarm_motion_reset_window') ? 5 : (this.getSetting('alarm_motion_reset_window') || 300);
  //   // Set a timeout after which the alarm_motion capability is reset
  //   if (this.motionAlarmTimeout) clearTimeout(this.motionAlarmTimeout);

  //   this.motionAlarmTimeout = setTimeout(() => {
  //     this.log('manual alarm_motion reset');
  //     this.setCapabilityValue('alarm_motion', false).catch(this.error);
  //   }, alarmMotionResetWindow * 1000);
  // }

  // onLuminanceMeasuredValueAttributeReport(measuredValue) {
  //   this.log('handle report (cluster: IlluminanceMeasurement, attribute: measuredValue, capability: measure_luminance), parsed payload:', measuredValue);
  //   this.setCapabilityValue('measure_luminance', measuredValue).catch(this.error);
  // }

  async onDeleted() {
    this.log('Motion Sensor removed');
  }

}

module.exports = MotionSensor;

// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] ZigBeeDevice has been initialized { firstInit: true, isSubDevice: false }
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] ------------------------------------------
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] Node: a68f3357-00c2-41a7-ba4e-3d7550204b74
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] - Receive when idle: false
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] - Endpoints: 1
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] -- Clusters:
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] --- basic
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] --- illuminanceMeasurement
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] --- occupancySensing
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] --- iasZone
// [log] 2022-11-30 15:10:55 [ManagerDrivers] [Driver:motion-sensor] [Device:0d9d5986-729c-45fc-b1a6-5b32cb3e1a96] ------------------------------------------

'use strict';

const Homey = require('homey');
const { debug } = require('zigbee-clusters');

// Enable zigbee-cluster logging
// debug(true);

class TeslaSmartApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('TeslaSmartApp has been initialized');
  }

}

module.exports = TeslaSmartApp;

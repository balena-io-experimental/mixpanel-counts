var _ = require("lodash");
var moment = require("moment");
var dotenv = require("dotenv").config();
var colors = require("colors");
var MixpanelExport = require("mixpanel-data-export-node");

["MIXPANEL_API_KEY", "MIXPANEL_API_SECRET"]
  .filter(key => process.env[key] == null)
  .forEach((key, idx, keys) => {
    console.error(`${key} env variable is not set.`);
    if (idx === keys.length - 1) {
      process.exit(1);
    }
  });

var panel = new MixpanelExport({
  api_key: process.env.MIXPANEL_API_KEY,
  api_secret: process.env.MIXPANEL_API_SECRET
});

var thisdate = moment().format("YYYY-MM-DD");
var defaultLimit = process.env.MAXCOUNT || 30;

var getReport = function(event) {
  panel
    .segmentation({
      from_date: thisdate,
      to_date: thisdate,
      event: event,
      on: 'properties["uuid"]',
      limit: defaultLimit
    })
    .then(function(data) {
      var devicelist = _(data.data.values)
        .toPairs()
        .map(kvArray => [kvArray[0], kvArray[1][thisdate]])
        .sortBy(kvArray => kvArray[1])
        .reverse()
        .value();
      console.log(`Event: ${event}`.bgGreen);
      _(devicelist).each(d => console.log(`${d[0].red}\t${d[1]}`));
      console.log();
    });
};

// Run the actual queries
[
  "Device info update failure",
  "Device state report failure",
  "Remove dead container",
  "Restart container",
  "Service exit",
  "Service restart",
  "Service kill",
  "Service already stopped",
  "Service stop error"
].forEach(getReport);

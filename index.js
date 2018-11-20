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

var days = process.env.DAYS || 3;
var now = moment();
var to_date = now.format("YYYY-MM-DD");
var from_date = now.subtract(days, "days").format("YYYY-MM-DD");
var defaultLimit = process.env.MAXCOUNT || 30;

var getReport = function(event) {
  panel
    .segmentation({
      from_date: from_date,
      to_date: to_date,
      event: event,
      on: 'properties["uuid"]',
      limit: defaultLimit
    })
    .then(function(data) {
      console.log(`Event: ${event} / ${days} day(s)`.bgGreen);
      if (data.error) {
        console.log(`${data.error.red}\n`);
      } else {
        var devicelist = _(data.data.values)
          .toPairs()
          .map(kvArray => [
            kvArray[0],
            _(kvArray[1])
              .values()
              .sum()
          ])
          .sortBy(kvArray => kvArray[1])
          .reverse()
          .value();
        _(devicelist).each(d => console.log(`${d[0].cyan}\t${d[1]}`));
        console.log();
      }
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

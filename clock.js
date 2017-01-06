/* eslint-disable no-new */
'use strict';

const CronJob = require('cron').CronJob;
const gatherData = require('./bots/gatherData.js');

new CronJob('59 23 7 * * *',
  gatherData.start,
  null,
  true,
  'America/Los_Angeles');

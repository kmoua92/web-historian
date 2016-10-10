// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var helpers = require('../helpers/archive-helpers');
var cron = require('cron').CronJob;

var cronJob = new cron({
	cronTime: '05 * * * * *',
	onTick: () => {
		helpers.readListOfUrls((urlArray) => {
			helpers.downloadUrls(urlArray);
		});
	},
	start: true,
	timeZone: 'America/Los_Angeles'
});

exports.cronJob = cronJob;

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var helpers = require('archive-helpers');

var cronWorker = new Cron({
	cronTime: 05 * * * * *,
	onTick: () => {
		helpers.readListOfUrls((urlArray) => {
			helpers.downloadUrls(urlArray);
		});
	}
	start: true
}).CronJob;
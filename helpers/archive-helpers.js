var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  home: path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


// For clientServer
exports.isUrlInList = function(url, cb) {

  fs.readFile(this.paths.list, (err, data) => {
    if (err) { throw err; }

    var urls = data.toString().split('\n');

    var urlIndex = urls.indexOf(url);

    // var urlFound = urls.filter( (element) => element === url );

    urlIndex !== -1 ? cb(true) : cb(false);
  });
};

exports.isUrlArchived = function(url, cb) {

  fs.access(this.paths.archivedSites + url, (err) => {
    if (!err) {
      cb(true);
    } else {
      cb(false);
    }
  });

};

exports.addUrlToList = function(url) {

  fs.write('../archives/sites.txt', url);

};



// For cronWorker
exports.readListOfUrls = function() {
  // for cronWorker
};

exports.downloadUrls = function() {
  // cronWorker
};

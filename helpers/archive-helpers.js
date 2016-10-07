var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

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

  // return new Promise((resolve, reject) => {
  //   fs.readFile(this.paths.list, () => {
  //     if (err) { reject(err); }

  //     var urls = data.toString().split('\n');

  //     var urlIndex = urls.indexOf(url);

  //     // var urlFound = urls.filter( (element) => element === url );

  //     urlIndex !== -1 ? resolve(true) : resolve(false);
  //   });
  // });
};

exports.isUrlArchived = function(url, cb) {

  // fs.access(this.paths.archivedSites + url, (err) => {
  //   if (!err) {
  //     cb(true);
  //   } else {
  //     cb(false);
  //   }
  // });

  if (url.charAt(0) !== '/') {
    url = '/' + url;
  }

  fs.readFile(this.paths.archivedSites + url, (err) => {
    
    (err) ? cb(false) : cb(true);

  });

};

exports.addUrlToList = function(url, cb) {

  var wrapperFunc = function() {
    fs.writeFile(this.paths.list, url, (err) => {
      if (err) { throw err; }
    });
  }.bind(this);

  cb(url, wrapperFunc());
};



// For cronWorker
exports.readListOfUrls = function(cb) {
  // for cronWorker
  fs.readFile(this.paths.list, (err, data) => {
    if (err) { throw err; }

    data = data.toString().split('\n');

    cb(data);
  });
};

exports.downloadUrls = function(urlArray) {
  // cronWorker
  var context = this; 
  // loop through array
  urlArray.forEach((url) => {
    
    var uri = 'http://' + url;
    var fileName = context.paths.archivedSites + '/' + url;

    request(uri, function (err, response, body) {
      body = JSON.stringify(body);
      if (!err && response.statusCode === 200) {
        
        fs.writeFile(fileName, body);

      }
    });  
  });
};

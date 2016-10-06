var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log('INSIDE OF handleRequest');
  
  if (req.method === 'GET') {
    // console.log(req.url)
    if (req.url === '/') {
      res.writeHead(200, httpHelpers.headers);
      res.end('/<input/'); 
    }

    

    // if isUrlArchived
    archive.isUrlArchived(req.url, (result) => {
      if (result) {

        fs.readFile(archive.paths.archivedSites + req.url, (err, data) => {
          if (err) { throw err; }

          var website = data.toString();
          res.end(website);
        });

      } else {
        res.writeHead(404, httpHelpers.headers);
        res.end('404 not found');
      }
    });
  }

  if (req.method === 'POST') {
    // if not in list
    archive.isUrlInList(req.url, function(isFound) {
      if (!isFound) {
        // console.log('===========================notFound')
        // append to list
        req.on('data', (data) => {
          // console.log('data=============', data);
          var urlRequested = data.toString().slice(4);
          // console.log('parsed============', urlRequested);
          fs.appendFile(archive.paths.list, urlRequested);
        });
      }
        
      
    });

      // append to list
  }


};

var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log('INSIDE OF handleRequest');
  
  if (req.method === 'GET') {
    if (req.url === '/') {
      return fs.readFile(archive.paths.home, (err, html) => {
        if (err) { throw err; }

        res.writeHead(200, httpHelpers.headers);
        res.end(html);

      }); 
    }
    
    // if isUrlArchived
    archive.isUrlArchived(req.url, (isArchived) => {
      
      if (isArchived) {

        fs.readFile(archive.paths.archivedSites + req.url, 'utf-8', (err, html) => {
          if (err) { throw err; }

          res.writeHead(200, httpHelpers.headers);
          res.end(html);
        });

      } else {
        res.writeHead(404, httpHelpers.headers);
        res.end('404: Website requested not found');
      }
    });
  }

  if (req.method === 'POST') {

    req.on('data', (data) => {
      data = data.toString().slice(4);

      
      archive.isUrlArchived(data, (isArchived) => {
        // if archived, redirect to page
        if (isArchived) {
          res.writeHead(302, {Location: '/' + data});
          res.end();
        } else {
          // if not archived, check if in list
          archive.isUrlInList(data, (isFound) => {
            // if not in list
            if (!isFound) {
              //append to list
              data = data + '\n';

              fs.appendFile(archive.paths.list, data, (err, data) => {
                if (err) { throw err; }

                // redirect to loading screen after appending
                fs.readFile(archive.paths.siteAssets + '/loading.html', (err, html) => {
                  if (err) { throw err; }

                  res.writeHead(202);
                  res.end(html);
                });
              });
              
            // if in already listed
            } else {
              // redirect to loading page
              fs.readFile(archive.paths.siteAssets + '/loading.html', (err, html) => {
                if (err) { throw err; }

                res.writeHead(202);
                res.end(html);
              });
            }  
          });  
        }
      });
    });
  }
};

var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log('INSIDE OF handleRequest');
  
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(archive.paths.home, (err, html) => {
        if (err) { throw err; }

        res.writeHead(200, httpHelpers.headers);
        res.end(html);

      }); 
    }

    if (req.url === '/') {
      fs.readFile(archive.paths.home, (err, html) => {
        if (err) { throw err; }

        res.writeHead(200, httpHelpers.headers);
        res.end(html);

      }); 
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

    req.on('data', (data) => {
      data = data.toString().slice(4);

      // check if in list
      archive.isUrlInList(data, (isFound) => {
        console.log('================ISFOUND', isFound);
        if (!isFound) {
          // check if archived
          archive.isUrlArchived(data, (isArchived) => {
            // if archived, redirect to page
            if (isArchived) {
              res.writeHead(302, {Location: '/' + req.url});
              res.end();
            } else {
              // if not archived, append to list
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
              
            }
          })

        } else {
          // if in list, redirect to loading page
          fs.readFile(archive.paths.siteAssets + '/loading.html', (err, html) => {
            if (err) { throw err; }

            res.writeHead(202);
            res.end(html);
          });
        }

        
      });


    });
      // if not in list, check if archived
        // if archived, redirect to page
      // if in list
        // return 202


  }


};

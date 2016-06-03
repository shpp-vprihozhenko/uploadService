/**
 * UserfilesController
 *
 * @description :: Server-side logic for managing userfiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  upload: function (req, res) {
    var dir = require('path').resolve(sails.config.appPath)+"/assets/images";

    console.log("req body on upload", req.body);

    function saveFileData(userName, fd, filename) {
      var request = require('request');
      request.post(
        'http://127.0.0.1:1337/userfiles',
        { body: {username: userName, filename: filename, fd: fd}, json: true },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body)
          } else {
            console.log(error);
          }
        }
      );
    }

    req.file('anyfile').upload({
      dirname: dir,
    }, function (err, files) {
      if (err)
        return res.serverError(err);

      res.redirect("back");

      console.log("Saving file data", req.body.userName, files[0].fd, files[0].filename);
      saveFileData(req.body.userName, files[0].fd, files[0].filename);
    });
  },

  download: function (req, res) {
    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);
    var dir = require('path').resolve(sails.config.appPath)+"/assets/images/";

    // Stream the file down
    var fd = req.param('fd');
    console.log("fd", fd, "full", dir+fd);

    fileAdapter.read(dir+fd)
      .on('error', function (err) {
        return res.serverError(err);
      })
      .pipe(res);
  }

};

angular.module('userApp', [])
  .controller('userController', ['$scope', '$http',
    function($scope, $http) {
      var _this = this;
      _this.arUploadedFiles = [];

      function showUploaded(name) {
        console.log("show uploaded list");

        _this.arUploadedFiles.splice(0, _this.arUploadedFiles.length);

        function formLinkFromFd(fd) {
          var baseUrl = document.URL+"userfiles/download?fd=";
          var onlyName = fd.substr(fd.lastIndexOf("/")+1);
          return baseUrl+onlyName;
        }

        $http({
          method: 'GET',
          url: '/userfiles/find'
        }).then(function successCallback(response) {
          var arUserFiles = response.data;
          console.log("got users data", response.data);
          for (var i=0; i<arUserFiles.length; i++){
            if (arUserFiles[i].username == name) {
              _this.arUploadedFiles.push("File "+arUserFiles[i].filename+", link: "+
                formLinkFromFd(arUserFiles[i].fd));
              console.log("found in userfiles list with name", arUserFiles[i].filename);
            }
          }
          console.log("arUploadedFiles", _this.arUploadedFiles);

        }, function errorCallback(response) {
          console.log("Error on userfiles request", response);
        });
      }

      function showUserUploadBlock(name) {
      var $upl = document.getElementById("upload");

      $upl.innerHTML = '<form action="http://localhost:1337/userfiles/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="userName" id="userName" ><br>' +
        '<input type="file" name="anyfile" ><br>' + //multiple="multiple"
        '<input type="submit" value="Upload" onclick="localStorage.setItem(\'fRedirected\', 1)">' +
        '</form>';
      var $uplName = document.getElementById("userName");
      $uplName.value = name;
      $uplName.style.visibility = "hidden";

      localStorage.setItem('user', name);

      showUploaded(name);
    }

    function findUserPwd(name, cb) {
      $http({
        method: 'GET',
        url: '/user/find'
      }).then(function successCallback(response) {
        var arUsers = response.data;
        for (var i=0; i<arUsers.length; i++){
          if (arUsers[i].name == name) {
            console.log("found in users list with pwd", arUsers[i].password);
            cb(arUsers[i].password);
            return;
          }
        }
        console.log("not found in users list");
        cb();
      }, function errorCallback(response) {
        console.log("Error on request");
        console.log(response);
        cb();
      });
    }

    function registryNewUser(name, password, cb) {
      $http({
        method: 'POST',
        data: {name: name, password: password},
        url: '/user'
      }).then(function successCallback(response) {
        console.log("ok create");
        cb();
      }, function errorCallback(response) {
        console.log("Error on create");
        console.log(response);
        cb();
      });
    }

    _this.name = "";
    _this.password = "";

    var name = localStorage.getItem('user');
    if (name){
      console.log("restored from localstorage", name)
      _this.name = name;

      if (localStorage.getItem('fRedirected')==1) {
        console.log("catch redirection!");
        localStorage.setItem('fRedirected', 0);
        showUserUploadBlock(_this.name);
      }

    }

      _this.copyToCB = function (link) {
        console.log("try copy to CB", link.substr(link.indexOf("link:")+6));
//        window.clipboardData.setData('Text', link.substr(link.indexOf("link:")+6));
        clipboard.copy(link.substr(link.indexOf("link:")+6));
      };

      _this.getName = function() {
      return _this.name;
    };

    _this.singInOrRegistry = function() {
      findUserPwd(_this.name, function(uPwd){
        if (uPwd != _this.password) {
          console.log("uPwd", uPwd, "_this.password", _this.password)
          if (confirm('Want to registry?')) {
            registryNewUser (_this.name, _this.password, function(){
              showUserUploadBlock(_this.name);
            });
          } else {
            _this.name = "";
            _this.password = "";
            return;
          }
        } else {
          showUserUploadBlock(_this.name);
        }
      });
    };

  }]);

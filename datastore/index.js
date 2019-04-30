const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((nullParam, id) => {
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err){
        throw err;
      }
      callback(null, {id, text });
    });
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir,(err, files) => {
    if (err) {
      throw err;
    }

    var allPromises = _.map(files,(filename) =>{
      return new Promise(function(resolve, reject){
        fs.readFile(path.join(exports.dataDir, filename), (err, text) => {
          if (err){
            reject(err);
          } else {
            var paddedId = filename.split('.')[0];
            resolve(JSON.stringify({id: paddedId, text: text.toString()}));
          }
        });
      });
    });

    Promise.all(allPromises).then(function (objects){
      var allTodos = _.map(objects, (object) => {
        return JSON.parse(object);
      });
      callback(null, allTodos);
    });
  });

};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir,id + '.txt'), (err, text) => {
    if (err) {
      callback(err);
      // throw err;
    } else {
      callback(null, {id: id, text: text.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(path.join(exports.dataDir,id + '.txt'), (err) => {
    if (err){
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir,id + '.txt'), text, (err) => {
        if (err){
          callback(err);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
    var allTodos = _.map(files, (filename) => {
      // fs.readFile(path.join(exports.dataDir,filename), (err, data) => {
      //   console.log('---->>>',data.toString());
      //   if (err) {
      //     throw err;
      //   }
      //   var id = filename.split('.')[0];
      //   var text = data.toString;
      //   return {id, text};
      // });
      var paddedId = filename.split('.')[0];
      return {id: paddedId, text: paddedId};
    });

    callback(null, allTodos);
  });

};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  // fs.writeFile(path.join(exports.dataDir,id + '.txt'), text, (err) => {
  //   if (err){
  //     callback(err);
  //   } else {
  //     callback(null, {id: id, text: text});
  //   }
  // });

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
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

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

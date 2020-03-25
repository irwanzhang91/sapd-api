var simpleInstance = require('../models/simpleInstance.js');
var queryFunction = require('../config/queryFunction.js');
var fileFunction = require('../config/fileFunction')
var randomstring = require('randomstring')

exports.updates = (req, res) => {
  simpleInstance.updates((results) => {
    res.send(queryFunction.checkSelectResult(results))
  })
}

exports.saveUpdate = (req, res) => {
    if(
        !req.body.update || req.body.update.length <= 0
    ){
        res.send({
            result: false,
            msg: 'Invalid data.'
        });
    }else{

      let data = {
        update: req.body.update
      }

      //save base64 to file
      let filename = randomstring.generate(30);
      let image_path = fileFunction.getFilePrefixPath() + 'updates/' + filename + '.png';
      fileFunction.base64toFile(req.body.update_image, image_path);
      data.image_path = image_path;


      simpleInstance.saveUpdate(data, (results) => {
        res.send(queryFunction.checkInsertResult(results))
      })

    }
};

exports.join = (req, res) => {
    if(
        !req.body.nominal || req.body.nominal <= 0 ||
        !req.body.bank_id || req.body.bank_id <= 0 ||
        !req.body.nama || req.body.nama.length <= 0 ||
        !req.body.catatan || req.body.catatan.length <= 0
    ){
        res.send({
            result: false,
            msg: 'Invalid data.'
        });
    }else{

      let data = {
        nominal: req.body.nominal,
        bank_id: req.body.bank_id,
        nama: req.body.nama,
        catatan: req.body.catatan,
        image_path: ''
      }

      //save base64 to file
      if(req.body.image_path) {
        let filename = randomstring.generate(30);
        let image_path = fileFunction.getFilePrefixPath() + 'good-people/' + filename + '.png';
        fileFunction.base64toFile(req.body.image_path, image_path);
        data.image_path = image_path;
      }

      simpleInstance.join(data, (results) => {
        res.send(queryFunction.checkInsertResult(results))
      })

    }
};

exports.goodpeople = (req, res) => {
  simpleInstance.goodpeople((results) => {
    res.send(queryFunction.checkSelectResult(results))
  })
}

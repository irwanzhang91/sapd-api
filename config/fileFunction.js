var fs = require('fs');

exports.getFilePrefixPath = () => {
    return 'uploads/';
}

exports.getRootPath = () => {
  // return 'public/'
  return '/var/www/sapd-api/public/'
}

exports.base64toFile = (dataurl, filename) => {
    //ambil data tanpa prefix nya..
    dataurl = dataurl.split('base64,');
    dataurl = dataurl[1];

    fs.writeFile(this.getRootPath() + filename, dataurl, 'base64', (err) => {
        if(err) console.log(err);
    });
}

exports.deleteFile = (filepath) => {
    filepath = 'public\\' + filepath;
    if(fs.existsSync(filepath)){
        fs.unlink(filepath, (err) => {
            if(err) throw err;
            console.log(filepath + ' was deleted.');
        });
    }
}

exports.moveFile = (old_path, new_path) => {
  fs.rename('/root/' + old_path, '../' + this.getRootPath() + new_path, (err) => {
    if(err) throw new Error(err)
    console.log(`File uploaded! -> ${new_path}`);
  })
}

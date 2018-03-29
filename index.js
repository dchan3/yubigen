const gm = require('gm'), https = require('https'), fs = require('fs'),
      url = require('url');

// Supported formats as listed on GraphicsMagick website
const FORMATS = ['ART', 'AVS', 'BMP', 'CALS', 'CIN', 'CGM', 'CMYK', 'CUR',
                 'CUT', 'DCM', 'DCX', 'DIB', 'DPX', 'EMF', 'EPDF', 'EPI',
                 'EPS', 'EPS2', 'EPS3', 'EPSF', 'EPSI', 'EPT', 'FAX', 'FIG',
                 'FITS', 'FPX', 'GIF', 'GRAY', 'GRAYA', 'HPGL', 'HTML', 'ICO',
                 'JBIG', 'JNG', 'JP2', 'JPC', 'JPEG', 'MAN', 'MAT', 'MIFF',
                 'MONO', 'MNG', 'MPEG', 'M2V', 'MPC', 'MSL', 'MTV', 'MVG',
                 'OTB', 'P7', 'PALM', 'PAM', 'PBM', 'PCD', 'PCDS', 'PCL',
                 'PCX', 'PDB', 'PDF', 'PFA', 'PFB', 'PGM', 'PICON', 'PICT',
                 'PIX', 'PNG', 'PNM', 'PPM', 'PS', 'PS2', 'PS3', 'PSD', 'PTIF',
                 'PWP', 'RAS', 'RAD', 'RGB', 'RGBA', 'RLA', 'RLE', 'SCT', 'SFW',
                 'SGI', 'SHTML', 'SUN', 'SVG', 'TGA', 'TIFF', 'TIM', 'TTF',
                 'TXT', 'UIL', 'UYVY', 'VICAR', 'VIFF', 'WBMP', 'WMF', 'WPG',
                 'XBM', 'XCF', 'XPM', 'XWD', 'YUV']

var bufferProcessHelper = (imgBuf, paramObj) => new Promise(
  (resolve, reject) => {
  var img =
    (paramObj.imageMagick ? gm.subClass({imageMagick: true}) : gm)(imgBuf);
  if (paramObj.resizeParams) img = img.resize(...paramObj.resizeParams);
  if (paramObj.cropParams) img = img.crop(...paramObj.cropParams);
  if (paramObj.textParams) {
    for (var i in paramObj.textParams) {
      var textParam = paramObj.textParams[i];
      img = img.fill(textParam.color || "#FF00FF").drawText(
      ...textParam.drawParams).fontSize(
        textParam.fontSize || "12pt"
      ).font(
          textParam.fontName || "Comic Sans"
      );
    }
  }
  img.toBuffer(
    paramObj.format && FORMATS.includes(paramObj.format.toUpperCase()
  ) ? paramObj.format.toUpperCase() : 'PNG', (error, buff) => {
    resolve(buff);
    reject(error);
  });
}),
bufferProcess = (buff, paramObj, cb) => {
  var func = bufferProcessHelper(buff, paramObj);
  func.then(cb);
  func.catch((error) => { throw error });
},
writeToFile = function(path, cb) {
  return function (result, err) {
    if (!err && result) {
      fs.writeFile(path, result, function(error) {
        if (error) cb(undefined, error);
        else cb(result, null);
      });
    }
    else cb(undefined, err);
  }
},
s3PutObject = function(config, bucket, path, cb) {
  return function (result, err) {
    // Look for `aws-sdk`. If not installed, return.
    if (!err && result) {
      try {
        require.resolve("aws-sdk");
      }
      catch (exc) {
        cb(undefined, exc);

        return;
      }

      var AWS = require("aws-sdk");

      if (config !== null) {
        if (config.constructor.name === "String") AWS.config.loadFromPath(config);
        else if (config.constructor.name === "Object") AWS.config.update({
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey
        });
      }
      new AWS.S3().putObject({
        Bucket: bucket,
        Key: path,
        Body: result
      }, function(error) {
        if (error) cb(undefined, error);
        else cb(result, null);
      });
    }
  }
},
fromUrl = (url, paramObj, cb) => {
  var imgBuf = new Buffer('');
  https.get(url, (response) => {
    response.on('data', (data) => {
      imgBuf = Buffer.concat([imgBuf, data]);
    });
    response.on('end', () => {
      bufferProcess(imgBuf, paramObj, cb);
    });
  }).on('error', (err) => {
    throw err;
  });
},
fromFile = (path, paramObj, cb) => {
  fs.readFile(path, (err, data) => {
    if (!err) bufferProcess(data, paramObj, cb);
    else throw err;
  });
},
fromBuffer = (buffer, paramObj, cb) => {
  bufferProcess(buffer, paramObj, cb);
};

const AUTOTYPE = ({
  "String": function(input, paramObj, cb) {
    if (url.parse(input).hostname) {
      fromUrl(input, paramObj, cb);
    }
    else {
      fs.open(input, 'r', (err, fd) => {
        if (err && err.code === 'ENOENT') {
          cb(undefined, err);
        }
        else if (fd) {
          fromFile(input, paramObj, cb);
        }
      });
    }
  },
  "Buffer": function(input, paramObj, cb) {
    fromBuffer(input, paramObj, cb);
  }
});

module.exports = {
  fromFile: fromFile,
  fromUrl: fromUrl,
  fromBuffer: fromBuffer,
  predict: (input, paramObj, cb) => {
    AUTOTYPE[input.constructor.name](input, paramObj, cb);
  },
  outToFile: function(outFile, input, paramObj, cb) {
    AUTOTYPE[input.constructor.name](input, paramObj, writeToFile(outFile, cb));
  },
  s3Put: (config, bucket, path, input, paramObj, cb) => {
    AUTOTYPE[input.constructor.name](input, paramObj, s3PutObject(config, bucket, path, cb));
  }
};

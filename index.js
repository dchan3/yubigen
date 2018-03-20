const gm = require('gm'), https = require('https'), fs = require('fs'),
      path = require('path');

const formats = ['ART', 'AVS', 'BMP', 'CALS', 'CIN', 'CGM', 'CMYK', 'CUR',
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

var bufferProcessHelper = (imgBuf, paramObj) => new Promise((resolve, reject) => {
  var img =
    (paramObj.imageMagick ? gm.subClass({imageMagick: true}) : gm)(imgBuf);
  if (paramObj.resizeParams) img = img.resize(...paramObj.resizeParams);
  if (paramObj.cropParams) img = img.crop(...paramObj.cropParams);
  img.toBuffer(
    paramObj.format && formats.includes(paramObj.format.toUpperCase()
  ) ? paramObj.format.toUpperCase() : 'PNG', (error, buff) => {
    resolve(buff);
    reject(error);
  });
}), bufferProcess = (buff, paramObj, cb) => {
  var func = bufferProcessHelper(buff, paramObj);
  func.then(cb);
  func.catch(() => { console.log("There was a problem.")});
};

module.exports = {
  fromUrl: (url, paramObj, cb) => {
    var imgBuf = new Buffer('');
    https.get(url, (response) => {
      response.on('data', (data) => {
        imgBuf = Buffer.concat([imgBuf, data]);
      });
      response.on('end', () => {
        bufferProcess(imgBuf, paramObj, cb);
      });
    }).on('error', (err) => {
      console.log("There was an error processing the image.");
    });
  },
  fromFile: (path, paramObj, cb) => {
    fs.readFile(path, (err, data) => {
      if (!err) bufferProcess(data, paramObj, cb);
      else console.log("There was an error processing the image.");
    });
  },
  fromBuffer: (buffer, paramObj, cb) => { bufferProcess(buffer, paramObj, cb); }
};

# YUBIGEN
Node Thumbnail generation without limits

[![NPM version](https://img.shields.io/npm/v/yubigen.svg?style=flat)](https://www.npmjs.com/package/yubigen)
![npm](https://img.shields.io/npm/dt/yubigen.svg)

## Prerequisites
Please refer to the operating system-specific instructions on installing the following before using YUBIGEN.
- both `graphicsmagick` and `imagemagick`
- `npm` and `node`
- `gm` package for `npm`. If `npm` has been installed, simply run `npm install gm`.

## Description of Implementation
YUBIGEN makes use of the [`resize`](http://aheckmann.github.io/gm/docs.html#resize) and [`crop`](http://aheckmann.github.io/gm/docs.html#crop) functions found in `gm` to resize and crop images according to specified parameters, respectively passed into the `resizeParams` and `cropParams` fields in the second parameter object in arrays. The third parameter is passed a callback which handles the resulting buffer in the specified manner.

YUBIGEN also has a way to predict the format of the input, as well as a function to output to a specified file without needing to specify a callback. Format-specific functions have been made available as well.

## Methods
### yubigen.fromURL(url, paramObj, callback)
Manipulates image given URL
### yubigen.fromFile(path, paramObj, callback)
Manipulates image from file given path
### yubigen.fromBuffer(buffer, paramObj, callback)
Manipulates image from a buffer given path
### yubigen.predict(input, paramObj, callback)
Predicts format (string or buffer) of the given input
### yubigen.outToFile(outFile, input, paramObj, callback)
Outputs to file as specified from input format prediction

## Parameter Object Keys
- `resizeParams`: resize parameters as specified by gm resize
- `cropParams`: crop parameters as specified by gm crop
- `format`: file format
- `imageMagick`: ImageMagick enabled if true

## Callback
- `result`: resulting buffer
- `err`: error if any

## Usage
```js
const yubigen = require('yubigen'), fs = require('fs'),
  AWS = require('aws-sdk'); // for demonstration purposes
var params = {
  resizeParams: [100], // resize parameters as specified by gm resize
  cropParams: [50,50,20,0], // crop parameters as specified by gm crop
  format: "JPEG", // file format
  imageMagick: false // ImageMagick enabled
}, writeFile = (result, err) => { // write to file callback
  fs.writeFile("bruh.png", result, (error) => {
    if (error) console.log(error);
  });
}, s3_upload = (result, err) => { // callback to upload to S3 Bucket, for demonstration purposes
  var args = {
    Bucket: BUCKET_NAME
    Key: KEY_NAME,
    Body: result
  }, var s3 = new AWS.S3();
  s3.putObject(args, function(error) {
    if (error) console.log(error);
  });
};

// From URL
yubigen.fromUrl("https://ktuh.org/img/ktuh-fm-logo.png", params, writeFile);

// From file
yubigen.fromFile("bruh.png", params, s3_upload);

// From buffer
fs.readFile('alpha.jpg', function(error, data) {
  yubigen.fromBuffer(data, { resizeParams: [90], cropParams: [50,50,20,0],
  format: "PNG"}, (result, err) => {
    fs.writeFile("gamma.png", result, (error) => {
      if (error) console.log(error);
    });
  });
});

// Export from URL to file
yubigen.outToFile('logo.png', "https://ktuh.org/img/ktuh-fm-logo.png", params, (result, err) {
  if (error) console.log(error);
  else console.log(result);
});
```

## Contributors
- Derek Chan

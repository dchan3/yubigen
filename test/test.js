const yubigen = require('../index.js'), fs = require('fs'),
      expect = require('chai').expect, assert = require('chai').assert;

describe('Basic functions', function () {
  it('for URL', function(done) {
    yubigen.fromUrl("https://ktuh.org/img/ktuh-fm-logo.png",
    { resizeParams: [100] }, (result, err) => {
      if (err) {
        assert.fail(0, 1);
        done();
      }
      fs.writeFile("test/images/bruh.png", result, (e) => {
        expect(result).to.not.be.undefined;
        expect(e).to.be.null;
        done();
      });
    });
  });

  it('for file', function(done) {
    yubigen.fromFile("test/images/bruh.png", { resizeParams: [200, 150, "!"],
    format: "JPEG"}, (result, err) => {
      if (err) {
        assert.fail(0, 1);
        done();
      }
      fs.writeFile("test/images/alpha.jpg", result, (e) => {
        expect(result).to.not.be.undefined;
        expect(e).to.be.null;
        done();
      });
    });
  });

  it('for buffer', function(done) {
    fs.readFile('test/images/alpha.jpg', function(error, data) {
      yubigen.fromBuffer(data, { resizeParams: [90], cropParams: [50,50,20,0],
      format: "PNG"}, (result, err) => {
        if (err) {
          assert.fail(0, 1);
          done();
        }
        fs.writeFile("test/images/gamma.png", result, (e) => {
          expect(result).to.not.be.undefined;
          expect(e).to.be.null;
          done();
        });
      });
    });
  });
});

describe('outToFile', function() {
  it('outToFile - URL', function(done) {
    yubigen.outToFile('test/images/the_logo.jpg', "https://ktuh.org/img/ktuh-fm-logo.png",
    {format: "JPEG", resizeParams: [125]}, (result, err) => {
      expect(result).to.not.be.undefined;
      expect(err).to.be.null;
      done();
    });
  });

  it('outToFile - buffer', function(done) {
    fs.readFile('test/images/alpha.jpg', function(error, data) {
      yubigen.outToFile('test/images/the_logo_2.jpg', data, {cropParams: [20,20,10,10],
      format: "JPEG"}, (result, err) => {
        expect(result).to.not.be.undefined;
        expect(err).to.be.null;
        done();
      });
    });
  });

  it('outToFile - file', function(done) {
    yubigen.outToFile('test/images/the_logo_3.jpg', "test/images/the_logo.jpg",
    {format: "JPEG", resizeParams: [105]}, (result, err) => {
      expect(result).to.not.be.undefined;
      expect(err).to.be.null;
      done();
    });
  });

  it('outToFile - file - fail', function(done) {
    yubigen.outToFile('test/images/the_logo_3.jpg', "test/images/donkey.jpg",
    {format: "JPEG", resizeParams: [105]}, (result, err) => {
      expect(err).to.be.ok;
      done();
    });
  });
});

describe('predict', function() {
  it('predict - URL', function(done) {
    yubigen.predict("https://ktuh.org/img/ktuh-fm-logo.png",
    {format: "JPEG", resizeParams: [105]}, (result, err) => {
      expect(result).to.not.be.undefined;
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('predict - file', function(done) {
    yubigen.predict("test/images/the_logo_3.jpg",
    {format: "JPEG", resizeParams: [105]}, (result, err) => {
      expect(result).to.not.be.undefined;
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('predict - buffer', function(done) {
    fs.readFile('test/images/alpha.jpg', function(error, data) {
      yubigen.predict(data,
      {format: "JPEG", resizeParams: [105]}, (result, err) => {
        expect(result).to.not.be.undefined;
        expect(result.constructor.name).to.equal("Buffer");
        expect(err).to.not.be.ok;
        done();
      });
    });
  });
});

describe('s3Put', function() {
  var settings = JSON.parse(process.env.SETTINGS);

  it('S3 - URL', function(done) {
    yubigen.s3Put({
      secretAccessKey: settings.secretAccessKey,
      accessKeyId: settings.accessKeyId
    }, settings.bucket, "alpha2.png", "https://ktuh.org/img/ktuh-fm-logo.png",
    {resizeParams: [108, 108, "!"], format: "PNG"}, (result, err) => {
      expect(result).to.not.be.undefined;
      expect(result.constructor.name).to.equal("Buffer");
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('S3 - file', function(done) {
    yubigen.s3Put({
      secretAccessKey: settings.secretAccessKey,
      accessKeyId: settings.accessKeyId
    }, settings.bucket, "the_logo.png", "test/images/the_logo.jpg",
    {resizeParams: [96, 96, "!"], format: "PNG"}, (result, err) => {
      expect(result).to.not.be.undefined;
      expect(result.constructor.name).to.equal("Buffer");
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('S3 - buffer', function(done) {
    fs.readFile('test/images/alpha.jpg', function(error, data) {
      yubigen.s3Put({
        secretAccessKey: settings.secretAccessKey,
        accessKeyId: settings.accessKeyId
      }, settings.bucket, "alpha.png", data,
      {resizeParams: [96, 96, "!"], format: "PNG"}, (result, err) => {
        expect(result).to.not.be.undefined;
        expect(result.constructor.name).to.equal("Buffer");
        expect(err).to.not.be.ok;
        done();
      });
    });
  });
});

describe("Text draw function - basic", function() {
  it('simply can draw text', function(done) {
    yubigen.outToFile('test/images/bruh_text.jpg', 'test/images/bruh.png',
    {
      resizeParams: [200],
      textParams: [
        {
          drawParams: [0, 0, "CENSORED", "Center"]
        }
      ],
      imageMagick: false
    },(result, err) => {
      expect(result).to.not.be.undefined;
      expect(result.constructor.name).to.equal("Buffer");
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('simply can draw text - color', function(done) {
    yubigen.outToFile('test/images/bruh_text_2.png', 'test/images/bruh.png',
    {
      resizeParams: [200],
      textParams: [
        {
          color: "#5940de",
          fontSize: "24pt",
          // (Tested on macOS) fontName: "/Library/Fonts/Comic Sans MS.ttf",
          drawParams: [0, 0, "CENSORED", "Center"]
        }
      ],
      format: "PNG"
    }, (result, err) => {
      expect(result).to.not.be.undefined;
      expect(result.constructor.name).to.equal("Buffer");
      expect(err).to.not.be.ok;
      done();
    });
  });
});

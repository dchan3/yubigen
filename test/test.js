const yubigen = require('yubigen'), fs = require('fs'),
      expect = require('chai').expect;

describe('It just works like magic.', function () {
  it('for URL', function(done) {
    yubigen.fromUrl("https://ktuh.org/img/ktuh-fm-logo.png",
    { resizeParams: [100] }, (result, err) => {
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
        fs.writeFile("test/images/gamma.png", result, (e) => {
          expect(result).to.not.be.undefined;
          expect(e).to.be.null;
          done();
        });
      });
    });
  });

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

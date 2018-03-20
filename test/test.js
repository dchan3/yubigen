const yubigen = require('yubigen'), fs = require('fs'),
      expect = require('chai').expect;

describe('It just works like magic.', function () {
  it('for URL', function(done) {
    yubigen.fromUrl("https://ktuh.org/img/ktuh-fm-logo.png",
    { resizeParams: [100] }, (result, err) => {
      fs.writeFile("bruh.png", result, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
  });

  it('for file', function(done) {
    yubigen.fromFile("bruh.png", { resizeParams: [200, 150, "!"],
    format: "JPEG"}, (result, err) => {
      fs.writeFile("alpha.jpg", result, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
  });

  it('for buffer', function(done) {
    fs.readFile('alpha.jpg', function(error, data) {
      yubigen.fromBuffer(data, { resizeParams: [90], cropParams: [50,50,20,0],
      format: "PNG"}, (result, err) => {
        fs.writeFile("gamma.png", result, (err) => {
          expect(err).to.be.null;
          done();
        });
      });
    });
  });
});

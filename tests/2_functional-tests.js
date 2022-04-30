const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .get('/hello?name=Scott_Henderson')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Scott_Henderson');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({
          "surname" : "Colombo"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response should be 200');
          assert.equal(res.type, 'application/json', 'Response is json')
          assert.equal(
            res.body.name,
            'Cristoforo',
            'res.body.name is Cristoforo'
            );
          assert.equal(
            res.body.surname,
            'Colombo',
            'res.body.surname is Colombo'
            );
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({
          "surname" : "da Verrazzano"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response is 200');
          assert.equal(res.type, 'application/json', 'type is JSON');
          assert.equal(
            res.body.name,
            'Giovanni',
            'res.body.name is Giovanni'
          );
          assert.equal(
            res.body.surname,
            'da Verrazzano',
            'res.body.surname is da Verrazzano'
          );
          done();
        });
    });
  });
});

const Browser = require('zombie');
const { suiteSetup } = require('mocha');
Browser.site = 'https://fccmochachai.herokuapp.com/'

suite('Functional Tests with Zombie.js', function () {
  const browser = new Browser()
  suiteSetup(function(done) {
    return browser.visit('/', done);
  })
  this.timeout(5000);



  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill('surname', 'Colombo').then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Cristoforo');
          browser.assert.text('span#surname', 'Colombo');
          browser.assert.elements('span#dates', 1);
          done();
        });
      });
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill('surname', 'Vespucci').then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Amerigo');
          browser.assert.text('span#surname', 'Vespucci');
          browser.assert.elements('span#dates', 1);
          done();
        });
      });
    });
  });
});

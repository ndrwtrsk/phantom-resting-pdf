const argsLen = process.argv.length;
const numberOfWorkers = parseInt(process.argv[2]);

if (argsLen != 3 || (numberOfWorkers <= 0 || numberOfWorkers > 6) || typeof numberOfWorkers != 'number') {
  console.log("\n>>> Please provide the number of workers!");
  console.log(">>> It should be bigger than 0 and smaller 6 Curreng count: " + numberOfWorkers + "\n");
  console.log(">>> It also should be a number... Is it a number? " + typeof numberOfWorkers + "\n");
  process.exit();
}

var conversion = require("phantom-html-to-pdf")({
  numberOfWorkers: numberOfWorkers
});

var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var dot = require('dot');
dot.templateSettings = {
  evaluate:    /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode:      /\{\{!([\s\S]+?)\}\}/g,
  use:         /\{\{#([\s\S]+?)\}\}/g,
  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'it',
  strip: false,
  append: true,
  selfcontained: false
};

var dots = dot.process({path: "./templates"});

var app = express();
var fs = require('fs');
// app.use();
var multer = require('multer');
var upload = multer();




app.get('/dot', bodyParser.json(), (req, res) => {



});

app.get('/1-page', function (req, res) {
  pipePDF(res, './html/1-page.html');
});

app.get('/2-page', function (req, res) {
  pipePDF(res, './html/2-page.html');
});

app.get('/3-page', function (req, res) {
  pipePDF(res, './html/3-page.html');
});

app.get('/3-page-random-values', (req, res) => {
  pipePDF(res, './html/3-page-random-values.html');
});

app.get('/3-page-random-data-length-local-data', (req, res) => {
  pipePDF(res, './html/3-page-random-data-length.html');
});

app.get('/3-page-random-data-length', (req, res) => {
  pipePDF(res, './html/3-page-random-data-length.html');
});


app.post('/generate-pdf-from-html', bodyParser.text({type: 'text/html'}), (req, res) => {

  conversion({
    html: req.body,
    fitToPage: true,
    waitForJS: true
  }, (err, pdf) => {
    // console.log(pdf);
    var fileStream = fs.createWriteStream('best.pdf');
    pdf.stream.pipe(fileStream);
    pdf.stream.pipe(res);
  });
});

app.post('/generate-pdf-from-data', bodyParser.json(), (req, res) => {
  var dataModel = JSON.stringify(req.body);
  var renderResult = dots.gen({data:dataModel});
  console.log('Processing dot...');
  conversion({
    html: renderResult,
    fitToPage: true,
    waitForJS: true
  }, (err, pdf) => {
    if(err) res.send(err);
    console.log("generated..");
    pdf.stream.pipe(res);
  });
});

var pipePDF = (res, filePath) => {
  conversion({
    url: filePath,
    fitToPage: true,
    waitForJS: true,
    allowLocalFilesAccess: true
  }, (err, pdf) => {
    pdf.stream.pipe(res);
  });
};

const port = 3000;

app.listen(port, () => {
  console.log(">>> Express listening on port: " + port);
  console.log(">>> Number of workers is equal to: " + numberOfWorkers);
});

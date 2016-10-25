const argsLen = process.argv.length;
const numberOfWorkers = parseInt(process.argv[2]);

if (argsLen != 3 || (numberOfWorkers <= 0 || numberOfWorkers > 6) || typeof numberOfWorkers != 'number' ) {
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
const util = require('util')

var app = express();
var fs = require('fs');
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.text({ type: 'text/html' }))
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.get('/1-page', function(req, res) {
  pipePDF(res, './html/1-page.html');
});

app.get('/2-page', function(req, res) {
  pipePDF(res, './html/2-page.html');
});

app.get('/3-page', function(req, res) {
  pipePDF(res, './html/3-page.html');
});

app.get('/3-page-random-values', (req, res) => {
  pipePDF(res, './html/3-page-random-values.html');
})

app.get('/3-page-random-data-length-local-data', (req, res) =>{
  pipePDF(res, './html/3-page-random-data-length.html');
})

app.get('/3-page-random-data-length', (req, res) =>{
  pipePDF(res, './html/3-page-random-data-length.html');
})


app.post('/generatehtml', upload.array(), (req, res) => {
  conversion({
    html: req.body,
    fitToPage: true,
    waitForJS: true
  }, (err, pdf) => {
    // console.log(pdf);
    var fileStream = fs.createWriteStream('best.pdf')
    pdf.stream.pipe(fileStream);
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
}

const port = 3000;

app.listen(port, () => {
  console.log(">>> Express listening on port: " + port);
  console.log(">>> Number of workers is equal to: " + numberOfWorkers);
});

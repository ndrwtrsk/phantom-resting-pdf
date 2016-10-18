const argsLen = process.argv.length;
const numberOfWorkers = parseInt(process.argv[2]);

if (argsLen != 3 || (numberOfWorkers <= 0 || numberOfWorkers > 5) || typeof numberOfWorkers != 'number' ) {
  console.log("\n>>> Please provide the number of workers!");
  console.log(">>> It should be bigger than 0 and smaller 6 Curreng count: " + numberOfWorkers + "\n");
  console.log(">>> It also should be a number... Is it a number? " + typeof numberOfWorkers + "\n");
  process.exit();
}

var conversion = require("phantom-html-to-pdf")({
  numberOfWorkers: numberOfWorkers
});

var express = require('express');
var app = express();

app.get('/1-page', function(req, res) {
  pipePDF(res, './html/1-page.html');
});

app.get('/2-page', function(req, res) {
  pipePDF(res, './html/2-page.html');
});

app.get('/3-page', function(req, res) {
  pipePDF(res, './html/3-page.html');
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

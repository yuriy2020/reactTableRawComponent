const express = require('express');
const router = express.Router();
const path = require("path");
let fs = require("fs");

router.get('/', function (req, res, next) {
  res.send('get==>>')
});

router.get('/getSettingsTable', (req, res) => {
  fs.readFile(path.resolve(__dirname, "table.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.send(data);
  })
})

router.post('/postSettingsTable', (req, res) => {
  fs.writeFile(
    path.resolve(__dirname, "table.json"),
    JSON.stringify(req.body, null, 2),
    (err) => {
      if (err) throw err;
      res.end()
    }
  );
})
module.exports = router;

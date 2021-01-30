var express = require("express");
var router = express.Router();
const path = require("path");
let fs = require("fs");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", async function (req, res) {
  if (req.body.firstEntry === 0) {
    console.log("---1--- Reload page", req.body);
    fs.readFile(path.resolve(__dirname, "table.json"), "utf8", (err, data) => {
      if (err) throw err;
      console.log("---2--- READ", data);
      res.send(data);
    });
  } else {
    fs.writeFile(
      path.resolve(__dirname, "table.json"),
      JSON.stringify(req.body, null, 2),
      (err) => {
        if (err) throw err;
        console.log("---3--- SAVE", req.body);
        res.end()
      }
    );
  }
  // res.status(404)
});

module.exports = router;

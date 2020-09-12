const express = require("express");
const router = express.Router();
const serverless = require("serverless-http");
var admin = require("firebase-admin");
var cron = require("node-cron");
var serviceAccount = require("../config/serviceaccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hotblock-48cbf.firebaseio.com",
});
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/", (req, res) => {
  const {
    blockindex,
    deposit_amount,
    userid,
    depositid,
    duration,
    rate,
  } = req.body;
  const newduration = parseInt(duration);

  var task = cron.schedule("* * * * *", () => {
    axios({
      url: "https://hotblockexpressapi.herokuapp.com/ipn",
      method: "post",
      data: req.body,
    });
    console.log(req.body);
    stopTask();
  });

  function stopTask() {
    return task.destroy();
  }

  task.start();
  res.json(req.body);
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);

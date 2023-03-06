/* eslint-disable no-undef */
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const serveStatic = require("serve-static");
const rootPath = path.join(__dirname, "dist");
app.use(serveStatic(rootPath));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors({ Credentials: true }));

let performanceList = [];
let errorList = [];

app.get("/getmap", (req, res) => {
  let fileName = req.query.fileName;
  let mapFile = path.join(__filename, "..", "dist/assets");
  let mapPath = path.join(mapFile, `${fileName}.map`);
  fs.readFile(mapPath, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
});

app.get("/xhrError", (req, res) => {
  const query = req.query;
  if (!query.foo) {
    res.send({
      status: 400,
      message: "缺失参数foo",
    });
  }
});

app.post("/fetchError", (req, res) => {
  const body = req.body;
  if (!body.bar) {
    res.send({
      status: 400,
      message: "body 不能为空",
    });
  }
});

app.get("/getErrorList", (req, res) => {
  res.send({
    status: 200,
    data: errorList,
  });
});

app.post("/reportData", (req, res) => {
  try {
    const data = JSON.parse(req.body).data;
    console.log(data, 71, performanceList.length, errorList.length);
    if (!data) return;
    if (data.type == "performance") {
      performanceList.push(data);
    } else if (data.type == "error") {
      errorList.push(data);
    }
    res.send({
      status: 200,
      message: "上报成功！",
      data,
    });
  } catch (err) {
    res.send({
      status: 203,
      message: "上报失败！",
      err,
    });
  }
});

app.listen(9999, () => {
  console.log("Server is running at http://localhost:9999");
});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const config = require("./secrets.json");

const tradfri = require("node-tradfri").create(config);

const PORT = 8081;

const asyncMw = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

async function stuff() {
  const devices = await tradfri.getDevices();
  const command = process.argv[2];
  const arguments = process.argv.slice(3);
  console.log(devices);
  const deviceId = devices.find(x => x.name === arguments[0]).id;
  let args = arguments.slice(1);
  if (command === "setDeviceState") {
    if ("color" === args[0]) {
      args = { color: args[1] };
    } else {
      args = { [args[0]]: Number(args[1]) };
    }
  }
  console.log(command, deviceId, args);
  await tradfri[command](deviceId, args);
}

app.get(
  "/devices",
  asyncMw(async (req, res, next) => {
    const devices = await tradfri.getDevices();
    res.json(devices);
  })
);

app.post(
  "/devices/:deviceId",
  asyncMw(async (req, res, next) => {
    console.log(req.body);
    const deviceId = req.params.deviceId;
    const command = req.body.command;
    delete req.body.command;
    const args = req.body;
    if (!command) {
      res.sendStatus(400);
    } else {
      const response = await tradfri[command](deviceId, args);
      res.json(response);
    }
  })
);

app.listen(PORT);

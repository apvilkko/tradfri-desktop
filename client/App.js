import React, { useState, useEffect, useRef } from "react";
import { debounce } from "debounce";

const SERVER_URL = "http://localhost:8081";

const COLD_WARM_COLORS = ["f5faf6", "f1e0b5", "efd275"];
const RGB_COLORS = [
  "4a418a",
  "6c83ba",
  "8f2686",
  "a9d62b",
  "c984bb",
  "d6e44b",
  "d9337c",
  "da5d41",
  "dc4b31",
  "dcf0f8",
  "e491af",
  "e57345",
  "e78834",
  "e8bedd",
  "eaf6fb",
  "ebb63e",
  "efd275",
  "f1e0b5",
  "f2eccf",
  "f5faf6"
];

const getType = item => {
  if (item.type.includes("bulb")) {
    return "💡";
  } else if (item.type.includes("remote control")) {
    return "⚪";
  }
  return "-";
};

const getColorChoices = device => {
  if (device.type.includes("bulb") && device.type.includes("CWS")) {
    return RGB_COLORS;
  } else if (device.type.includes("bulb") && device.type.includes("WS")) {
    return COLD_WARM_COLORS;
  }
  return null;
};

const ColorChooser = ({ device, setCommand }) => {
  const [colors, setColors] = useState(getColorChoices(device));

  useEffect(() => {
    setColors(getColorChoices(device));
  }, [device]);

  if (colors === null) {
    return null;
  }
  return (
    <div>
      {colors.map(color => (
        <button
          className="color"
          style={{ backgroundColor: `#${color}` }}
          key={color}
          onClick={() => {
            setCommand({
              deviceId: device.id,
              command: "setDeviceState",
              color: color
            });
          }}
        >
          <span className="sr">{color}</span>
        </button>
      ))}
    </div>
  );
};

const DeviceDetail = ({ device, setCommand }) => {
  const [slider, setSlider] = useState(device.brightness);

  const sliderChanged = useRef(
    debounce(value => {
      if (
        typeof value === "undefined" ||
        value === null ||
        value === device.brightness
      ) {
        return;
      }
      setCommand({
        deviceId: device.id,
        command: "setDeviceState",
        brightness: value
      });
    }, 200)
  );

  useEffect(() => {
    setSlider(device.brightness);
  }, [device]);

  useEffect(() => {
    sliderChanged.current(slider);
  }, [slider]);

  return (
    <div className="device-detail">
      <button
        onClick={() =>
          setCommand({
            deviceId: device.id,
            command: device.on ? "turnOffDevice" : "turnOnDevice"
          })
        }
      >
        {device.on ? "on" : "off"}
      </button>
      {device.hasOwnProperty("brightness") ? (
        <input
          id={`brightness-${device.id}`}
          type="range"
          min="0"
          max="254"
          value={slider}
          onChange={evt => {
            setSlider(Number(evt.target.value));
          }}
        />
      ) : null}
      <ColorChooser device={device} setCommand={setCommand} />
    </div>
  );
};

const Devices = () => {
  const [data, setData] = useState([]);
  const [command, setCommand] = useState({});

  useEffect(() => {
    const fetchDevices = async () => {
      const resp = await fetch(SERVER_URL + "/devices");
      setData(await resp.json());
    };

    const fetchData = async () => {
      if (!command.command) {
        await fetchDevices();
      } else if (command.deviceId) {
        const resp = await fetch(SERVER_URL + "/devices/" + command.deviceId, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(command)
        });
        await fetchDevices();
      }
    };

    fetchData();
  }, [command]);

  return (
    <div>
      <div className="devices">
        {data.map(item => (
          <div key={item.id} className="device">
            {getType(item)}
            {item.name}
            <DeviceDetail device={item} setCommand={setCommand} />
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Devices />
    </div>
  );
};

export default App;

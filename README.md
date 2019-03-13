# IKEA Trådfri desktop

Node server + React client for controlling IKEA Trådfri gateway.

## Setup

Refer to [node-tradfri setup instructions](https://github.com/morzzz007/node-tradfri) and create the file `server/secrets.json`:

```
{
  "coapClientPath": "[path to coap-client binary]"
  "identity": "...",
  "preSharedKey": "...",
  "hubIpAddress": "..."
}
```

1. Run npm install in root folder & client and server folder
1. Run server from server folder with `npm start`.
1. Run client from client folder with `npm start`.

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
1. Run server & client from root with `SERVER_URL=PUBLIC_IP npm start` (where PUBLIC_IP is e.g. your local server ip, otherwise localhost is used)

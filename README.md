# Channel client JS
Javascript library for async data flow  implementation for browsers.

- [Channel Client JS](#channel-client-js)
- [How to use](#how-to-use)
  - [Install](#install)
  - [Usage](#asyncClient-basic-usage-example)
- [How can I help?](#how-can-i-help)

## How to use
you need to have a running instances of  [async-dataflow-channel-sender](https://github.com/bancolombia/async-dataflow-channel-sender)

### Install

```npm
npm install chanjs-client --save
```


### AsyncClient basic usage example

```javascript
import { AsyncClient } from 'chanjs-client';

...
const client = new AsyncClient({
    socket_url: "wss://some.domain:8984/socket",
    channel_ref: "some_channel_ref",
    channel_secret: "secret_from_some_auth_service",
    heartbeat_interval: 200
});
...
```
   |  **Parameters** | Description                                   | Default Value |
   | -------------------------------- | -------------------------------------- | ------------------ |
   | socket_url                          |[async-dataflow-channel-sender](https://github.com/bancolombia/async-dataflow-channel-sender) cluster url         |       |
   | channel_ref                          | channel getted from rest service of [async-dataflow-channel-sender](https://github.com/bancolombia/async-dataflow-channel-sender)   |                    |
   | channel_secret                          | token getted from rest service of [async-dataflow-channel-sender](https://github.com/bancolombia/async-dataflow-channel-sender)|                    |
   | heartbeat_interval                          | time in milliseconds to verify socket connection |                   |
   

```javascript
client.listenEvent("event.some-name", message => someCallback(message.payload));
```



## How can I help?

Review the [issues](https://github.com/bancolombia/async-dataflow-channel-client-js/issues). Read [how Contributing](hhttps://github.com/bancolombia/async-dataflow-channel-client-js/wiki/Contributing).

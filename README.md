### The decision was made to have all async data flow components in a [single repository.](https://github.com/bancolombia/async-dataflow)

# Channel client JS
[![NPM](https://nodei.co/npm/chanjs-client.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/chanjs-client/)

Javascript library for async data flow  implementation for browsers.

- [Channel Client JS](#channel-client-js)
- [How to use](#how-to-use)
  - [Install](#install)
  - [Usage](#asyncclient-basic-usage-example)
- [How can I help?](#how-can-i-help)

## How to use
you need to have a running instances of  [async-dataflow-channel-sender](https://github.com/bancolombia/async-dataflow-channel-sender)

### Install

```npm
npm install chanjs-client --save
```


### AsyncClient basic usage example
You can understand better the flow with this sequence diagram.
![imagen](https://user-images.githubusercontent.com/12372370/137554898-0d652b9c-2598-4e1b-b681-554e0a9f00e7.png)


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
   | heartbeat_interval                          | time in milliseconds to verify socket connection  **this parameter must be less than the socket_idle_timeout on the channel sender**|       750            |
  | enable_binary_transport                          | boolean parameter to indicate use binary protocol |       false            |
   

```javascript
client.listenEvent("event.some.name", message => someCallback(message.payload));
```

You can also use amqp-match style name expressions when susbscribing to events. Examples:

```javascript
client.listenEvent("event.#", message => someCallback(message.payload));
client.listenEvent("event.some.*", message => someCallback(message.payload));
```

## How can I help?

Review the [issues](https://github.com/bancolombia/async-dataflow-channel-client-js/issues). Read [how Contributing](hhttps://github.com/bancolombia/async-dataflow-channel-client-js/wiki/Contributing).

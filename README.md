# Channel client JS
Javascript library for async data flow  implementation for browsers.

- [Channel Client JS](#channel-client-js)
- [How to use](#how-to-use)
  - [Install](#install)
  - [Usage](#asyncClient-basic-usage-example)
- [How can I help?](#how-can-i-help)

## How to use

### Install

```npm
npm install chanjs-client --save
```


### AsyncClient basic usage example

```
import { AsyncClient } from 'chanjs-client';

...
const client = new AsyncClient({
    socket_url: "wss://some.domain:8984/socket",
    channel_ref: "some_channel_ref",
    channel_secret: "secret_from_some_auth_service",
    heartbeat_interval: 200
});

client.listenEvent("event.some-name", message => someCallback(message.payload));

```

## How can I help?

Review the [issues](https://github.com/bancolombia/async-dataflow-channel-client-js/issues). Read [how Contributing](hhttps://github.com/bancolombia/async-dataflow-channel-client-js/wiki/Contributing).

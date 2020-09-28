## AsyncClient basic usage example


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

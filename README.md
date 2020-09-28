## Mercurio Client JS

Ejemplo de uso básico en Angular

```
import { MercurioFactory } from 'merclijs';

...

const mercurio = MercurioFactory.getClient({
    apiKey: 'your-privided-api-key',
    log: true,
    authEndpoint: 'https://realhost/mercurio/external/auth',
    cluster: 'us2',
    fragmentsTimeout: 20000 // Completion Timeout for fragmented messages
    token: token // Token real de autenticación a ser enviado al authEndpoint
})

mercurio.startListenSelfChannel(data => callbackDeApplicacion(data), err => fragmentTimeoutCallback(err));

...
//
someRefreshTokenService.setUpdateTokenCallback(newToken => mercurio.updateEventsToken(newToken));
```
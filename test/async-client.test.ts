import * as chai from 'chai';

import {AsyncClient} from "../src/async-client";
import { WebSocket, Server } from 'mock-socket';

import {ChannelMessage} from "../src/channel-message";
import {JsonDecoder} from "../src/json-decoder";

const assert = chai.assert;

function timeout(millis : number) : Promise<any> {
    return new Promise(resolve => {
        // @ts-ignore
        setTimeout(resolve, millis, "timeout");
    });
}

describe('Async client Tests', function()  {
    let mockServer;
    let client : AsyncClient;
    let config = {
        socket_url: "wss://host.local/socket",
        channel_ref: "ab771f3434aaghjgr",
        channel_secret: "secret234342432dsfghjikujyg1221",
    };

    beforeEach(() => {
        mockServer = new Server("wss://host.local/socket");
        client = new AsyncClient(config, WebSocket);
    })

    afterEach((done) => {
        mockServer.stop(() => done());
    });

    after(() => {
        client.disconnect();
    });

    it('Should try to connect with correct url' , () => {
        client.connect();
        assert.equal(client.rawSocket().url, "wss://host.local/socket?channel=ab771f3434aaghjgr");
        client.disconnect();
    });

    it('Should notify socket connect' , async() => {
        client.connect();
        const isOpen = await new Promise<boolean>(resolve => client.doOnSocketOpen((event) => resolve(client.isOpen)));
        assert.isTrue(isOpen);
        client.disconnect();
    });

    it('Should authenticate with server and route message' , async() => {
        mockServer.on('connection', socket => {
            socket.on('message', data => {
                if (data == `Auth::${config.channel_secret}`){
                    socket.send('["", "", "AuthOk", ""]');
                    socket.send('["12", "", "person.registered", "CC111222"]');
                }else {
                    socket.send('["", "", "NoAuth", ""]');
                }
            });
        });

        assert.isFalse(client.isActive);
        const message = new Promise<boolean>(resolve => client.listenEvent("person.registered", message => resolve(message)));
        client.connect();

        const result = await Promise.race([timeout(200), message]);
        // @ts-ignore
        assert.isTrue(client.isActive);
        assert.notEqual(result, "timeout");
        client.disconnect();
    });


    it('Should send ack on message' , async() => {
        mockServer.on('connection', socket => {
            socket.on('message', data => {
                if (data == `Auth::${config.channel_secret}`){
                    socket.send('["", "", "AuthOk", ""]');
                    socket.send('["12", "", "person.registered", "CC111222"]');
                }else if (data == 'Ack::12'){
                    socket.send('["14", "", "ack.reply.ok", "ok"]');
                }
            });
        });

        const message = new Promise<boolean>(resolve => client.listenEvent("ack.reply.ok", message => resolve(message)));
        client.connect();

        const result = await Promise.race([timeout(500), message]);
        // @ts-ignore
        assert.deepEqual(result, new ChannelMessage("14", "ack.reply.ok", "", "ok"));
        client.disconnect();
    });


});


describe('Async Reconnection Tests', () =>  {

    let config = {
        socket_url: "wss://reconnect.local:8984/socket",
        channel_ref: "ab771f3434aaghjgr",
        channel_secret: "secret234342432dsfghjikujyg1221",
        heartbeat_interval: 200
    };


    it('Should ReConnect when server closes the socket' , async() => {
        let mockServer = new Server("wss://reconnect.local:8984/socket");
        let client : AsyncClient = new AsyncClient(config, WebSocket);
        mockServer.on('connection', socket => {
            socket.on('message', data => {
                if (data == `Auth::${config.channel_secret}`){
                    socket.send('["", "", "AuthOk", ""]');
                    socket.send('["12", "", "person.registered", "CC111222"]');
                }
            });
        });

        const message = new Promise<string>(resolve => client.listenEvent("person.registered", message => resolve(message.payload)));
        client.connect();

        const result = await message;
        assert.equal(result, "CC111222");

        mockServer.close();
        mockServer.stop();

        // @ts-ignore
        await timeout(700);
        const newData = new Promise<string>(resolve => client.listenEvent("person.registered2", message => resolve(message.payload)));
        mockServer = new Server("wss://reconnect.local:8984/socket");
        mockServer.on('connection', socket => {
            socket.on('message', data => {
                if (data == `Auth::${config.channel_secret}`){
                    socket.send('["", "", "AuthOk", ""]');
                    // @ts-ignore
                    setTimeout(() => socket.send('["12", "", "person.registered2", "CC1112223"]'), 200)
                }
            });
        });

        const message2 = await newData;
        assert.equal(message2, "CC1112223");
        client.disconnect();
        mockServer.close();
        await new Promise(resolve => mockServer.stop(resolve));
    });


    it('Should ReConnect when no heartbeat' , async() => {
        config.socket_url = "wss://reconnect.local:8987/socket";
        let mockServer = new Server(config.socket_url);
        let client : AsyncClient = new AsyncClient(config, WebSocket);
        let respondBeat = false;
        let socketSender;
        let connectCount = 0;

        mockServer.on('connection', socket => {
            socketSender = socket;
            socket.on('message', data => {
                if (data == `Auth::${config.channel_secret}`){
                    connectCount = connectCount + 1;
                    socket.send('["", "", "AuthOk", ""]');
                    // @ts-ignore
                    setTimeout(() => socket.send('["12", "", "person.registered", "CC111222"]'), 200)
                }else if (data.startsWith("hb::") && respondBeat){
                    let correlation = data.split("::")[1];
                    socket.send(`["", ${correlation}, ":hb", ""]`);
                }
            });
        });

        client.connect();

        await timeout(600);
        respondBeat = true;
        const lastCount =  connectCount;
        // @ts-ignore
        console.log("Count", connectCount);

        await timeout(700);
        client.disconnect();
        await new Promise(resolve => mockServer.stop(resolve));
        assert.approximately(connectCount, lastCount, 1);

    });


});


describe('Refresh token Tests', () =>  {

    let config = {
        socket_url: "wss://reconnect.local:8985/socket",
        channel_ref: "ab771f3434aaghjgr",
        channel_secret: "secret234342432dsfghjikujyg1221",
        heartbeat_interval: 200
    };


    it('Should ReConnect with new token' , async() => {
        let mockServer = new Server(config.socket_url);
        let client : AsyncClient = new AsyncClient(config, WebSocket);
        let socketSender;
        mockServer.on('connection', socket => {
            socketSender = socket;
            socket.on('message', data => {
                if (data == `Auth::${config.channel_secret}`){
                    socket.send('["", "", "AuthOk", ""]');
                    socket.send('["01", "", ":new_tkn", "new_token_secret12243"]');
                    socket.send('["02", "", "person.registered", "CC10202029"]');
                }
            });
        });

        const message = new Promise<string>(resolve => client.listenEvent("person.registered", message => resolve(message.payload)));
        client.connect();
        const result = await message;

        mockServer.close();
        mockServer.stop();

        // @ts-ignore
        await timeout(200);
        config.channel_secret = "new_token_secret12243";
        const newData = new Promise<string>(resolve => client.listenEvent("person.registered2", message => resolve(message.payload)));
        mockServer = new Server(config.socket_url);
        mockServer.on('connection', socket => {
            socket.on('message', data => {
                if (data == `Auth::${config.channel_secret}`){
                    socket.send('["", "", "AuthOk", ""]');
                    socket.send('["12", "", "person.registered2", "CC1112223"]');
                }else if (data.startsWith("Auth::")){
                    // @ts-ignore
                    console.log("Credenciales no validas");
                    mockServer.close({code: 4403, reason: "Invalid auth", wasClean: true})
                }
            });
        });

        const message2 = await newData;
        assert.equal(message2, "CC1112223");
        client.disconnect();
        await new Promise(resolve => mockServer.stop(resolve));
    });

});


describe('Setup and configuration Tests', () =>  {

    const baseConf = {
        socket_url: "wss://reconnect.local:8985/socket",
        channel_ref: "ab771f3434aaghjgr",
        channel_secret: "secret234342432dsfghjikujyg1221"
    };

    it('Should use Json decoder when specified' , () => {
        let config = {...baseConf,
            only_json: true
        };
        let client : AsyncClient = new AsyncClient(config, WebSocket);
        assert.instanceOf(client.getDecoder(), JsonDecoder);
    });

});

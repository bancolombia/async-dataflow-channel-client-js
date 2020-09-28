import * as chai from 'chai';

import {Serializer} from "../src/serializer";
import {ChannelMessage} from "../src/channel-message";

const assert = chai.assert;
describe('Serializer Tests', function()  {

    it('Should decode basic string payload' , () => {
        let payload = "[\"ids332msg1\", \"\", \"person.registered\", \"someData\"]";
        const message = Serializer.decode(payload);
        assert.deepEqual(message, new ChannelMessage("ids332msg1", "person.registered", "", "someData"));
    });

    it('Should encode basic Message' , () => {
        const message : ChannelMessage = {
            message_id: "123",
            correlation_id: "",
            event: "evt.name",
            payload: "echo12"
        }
        const encoded = Serializer.encode(message);
        assert.equal(encoded, '["123","","evt.name","echo12"]');
    });

});

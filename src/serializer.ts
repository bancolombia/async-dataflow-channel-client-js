/* The default serializer for encoding and decoding messages */


import {ChannelMessage} from "./channel-message";

export class Serializer {

    public static decode(rawPayload: string): ChannelMessage {
        const [message_id, correlation_id, event, payload] = JSON.parse(rawPayload);
        return new ChannelMessage(message_id, event, correlation_id, payload);
    }

    public static encode(message: ChannelMessage): string {
        let payload = [
            message.message_id, message.correlation_id, message.event, message.payload
        ]
        return JSON.stringify(payload);
    }
}


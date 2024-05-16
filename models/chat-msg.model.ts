import { Schema, model, Document } from "mongoose";

const chatMsgSchema = new Schema({

    created: {
        type: Date
    },
    msg: {
        type: String,
    },
    file: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
});

chatMsgSchema.pre<IChatMsg>('save', function (next) {
    this.created = new Date();
    next();
});

interface IChatMsg extends Document {
    created: Date;
    msg: string;
    file: string;
    owner: string;
    users: string;
}

export const ChatMsg = model<IChatMsg>('ChatMsg', chatMsgSchema);
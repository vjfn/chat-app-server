import { Schema, model, Document } from "mongoose";
import bcrypt, { compare, compareSync } from 'bcrypt';



const usuarioSchema = new Schema({

    name: {
        type: String,
        required:[true, 'El nombre es obligatorio'],
        unique: true
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    created: {
        type: Date
    },
    socketId: {
        type: String
    },
    online: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: new Date()
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }]
});

usuarioSchema.method('compararPassword', function( password: string= ''): boolean{

    if (bcrypt.compareSync(password, this.password)){
        return true
    }else{
        return false;
    }
})

usuarioSchema.pre<IUsuario>('save', function (next) {
    this.created = new Date();
    next();
});

interface IUsuario extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;
    created: Date;
    socketId: string;
    online: boolean;
    lastSeen: Date;
    friends: string[];

    compararPassword(password: string): boolean;
}


export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
export { IUsuario };
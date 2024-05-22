import express from 'express';
import http from 'http';
import { Server as SocketServer, Socket} from 'socket.io';

import userRoutes from './routes/usuario';

import mongoose from 'mongoose';

import cors from 'cors';

import bodyParser from 'body-parser';
import postRoutes from './routes/post';

import fileUpload from 'express-fileupload'
import SocketCustomEvents from './sockets/sockets-custom-events';
import chatMsgRoutes from './routes/chat-msg';

import path from 'path';

/* const server = new Server({ cors: { origin: 'http://localhost:4200' } }); */

const app = express();
// Configurar CORS
app.use(cors({ origin: true, credentials: true}));
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: { origin: 'https://quepasa.flushfinder.es' }
});

//MIDDLEWARE el orden es importante, segun su uso

//bodyParser-Middleware body parser va siempre primero
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, '.', 'uploads')));

//fileUpload-Middleware, gestor de archivos
app.use( fileUpload());

//Configurar CORS
/* app.use(cors({ origin: true, credentials: true})); */

//Rutas de mi app, las rutas van al final
app.use('/', userRoutes) 
app.use('/user', userRoutes)
app.use('/posts', postRoutes)
app.use('/msg', chatMsgRoutes)

//Conexion a DB (protocolo,puerto,nombre de bd)
//TODO Conexion segura a BD
mongoose.connect(`mongodb://admin:multisyncv72mongodb@localhost:27017/quepasa-test?authMechanism=DEFAULT&authSource=admin`);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    // estamos conectados!
    console.log('Connected to MongoDB');
});

// Levantar express
/* server.start(() => {
    console.log(`Servidor corriendo en puerto: ${server.port}`)
}) */

io.on('connection', (socket: Socket) => {
    const socketCustomEvents = new SocketCustomEvents(io, socket);
    socketCustomEvents.subscribeAll();
})

const PORT = 4000; // Pueto deseado
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
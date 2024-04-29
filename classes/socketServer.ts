import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

export default class SocketServer {
    private app: express.Application;
    private server: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: 'http://localhost:8100',
                methods: ['GET', 'POST', 'PUT']
            }
        });
    }

    public start(callback: () => void): void {
        this.server.listen(3000, () => {
            console.log('Socket server running on port 3000');
            callback();
        });

        this.setupSocketEvents();
    }

    private setupSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('A user connected');

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
}

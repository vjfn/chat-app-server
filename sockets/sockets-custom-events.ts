import { Server, Socket } from 'socket.io';
import { Usuario } from '../models/usuario.model';
import { ChatMsg } from '../models/chat-msg.model';

export default class SocketsCustomEvents {
  private io: Server;
  private socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    this.socket.emit('connected', 'Conectado al servidor');
  }

  public subscribeAll() {
    // handle login and logout
    this.socket.on('login', async (data: any) => {
      console.log('usuario conectado ' + data.name)
      console.log(this.socket.id);
      const userDB = await Usuario.findOneAndUpdate({ name: data.name }, {
        online: true,
        lastSeen: new Date(),
        socketId: this.socket.id
      }, { new: true }).populate('friends', 'socketId');

      if (userDB?.friends) {
        userDB.friends.forEach((friend: any) => {
          this.socket.to(friend.socketId).emit('friend-status', { name: userDB?.name, online: true });
        });
      }
    });

    this.socket.on('logout', async () => {
      const userDB = await Usuario.findOneAndUpdate({ socketId: this.socket.id }, {
        online: false,
        lastSeen: new Date()
      }, { new: true }).populate('friends', 'socketId');

      if (userDB?.friends) {
        userDB.friends.forEach((friend: any) => {
          this.socket.to(friend.socketId).emit('friend-status', { name: userDB?.name, online: false });
        });
      }
    });

    this.socket.on('disconnect', async () => {
      const userDB = await Usuario.findOneAndUpdate({ socketId: this.socket.id }, {
        online: false,
        lastSeen: new Date()
      }, { new: true }).populate('friends', 'socketId');
      
      if (userDB?.friends) {
        userDB.friends.forEach((friend: any) => {
          this.socket.to(friend.socketId).emit('friend-status', { name: userDB?.name, online: false });
        });
      }
    });

    // handle add user
    this.socket.on('add-user', async (name) => {
      console.log('add-user', name);
      const user: any = await Usuario.findOne({ name }).select('name avatar lastSeen online');

      if (!user) return this.socket.emit('user-added', { error: 'User not found' });

      const mySelf = await Usuario.findOneAndUpdate({ socketId: this.socket.id }, {
        $addToSet: { friends: user._id }
      }, { new: true });

      if (mySelf?.socketId === user.socketId) return this.socket.emit('user-added', { error: 'You cannot add yourself' });

      this.socket.emit('user-added', user);
    });

    // handle message to user
    this.socket.on('message-to-user', async (data) => {
      const user = await Usuario.findOne({ name: data.to })
      console.log({ user, data});

      if (user) {
        const mySelf = await Usuario.findOne({ socketId: this.socket.id });

        const file = data.file ? `/${mySelf?._id}/posts/${data.file}` : null;

        this.socket.to(user.socketId).emit('message-to-user', { from: mySelf?.name, message: data.message, file });
        ChatMsg.create({
          msg: data.message,
          owner: mySelf?._id,
          receiver: user._id,
          file
        })
      }
    });

    // this.socket.on('message', (data) => {
    //   console.log(data);
    //   socket.broadcast.emit('received', { data: data, message: 'Esto es un mensaje de prueba desde el server.' });
    // })
  }
}
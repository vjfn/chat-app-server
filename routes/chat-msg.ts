import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/authentication";
import { ChatMsg } from '../models/chat-msg.model';
import { FileUpload } from "../interfaces/file-upload";
import { UploadedFile } from "express-fileupload";
import { FileSystem } from "../classes/file-system";
import { Usuario } from '../models/usuario.model';



const chatMsgRoutes = Router();

chatMsgRoutes.post('/', [verificaToken], async (req: any, res: Response) => {
    const owner = req.usuario._id;
    const body = req.body;
    console.log({
        body
    });
    const receiver = await Usuario.findOne({ name: body.receiver });
    console.log({
        receiver
    });
    const lastMsgs = await ChatMsg.find({ 
        $or: [
            { owner, receiver: receiver?._id },
            { owner: receiver?._id, receiver: owner }
        ]
    })
        .populate('owner', 'name')
        .populate('receiver', 'name')
        .sort({ created: 'desc' })
        .limit(30)
        .exec();


    return res.json({ ok: true, lastMsgs });
});

chatMsgRoutes.post('/', [verificaToken], async (req: any, res: Response) => {

});


export default chatMsgRoutes;
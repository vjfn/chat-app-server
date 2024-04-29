import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/authentication";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import { UploadedFile } from "express-fileupload";
import { FileSystem } from "../classes/file-system";
import { Usuario } from '../models/usuario.model';



const postRoutes = Router();

const fileSystem = new FileSystem();




//CRUD post
//CREATE post
postRoutes.post('/', [verificaToken], async (req: any, res: Response) => {
    try {
        const body = req.body;
        body.usuario = req.usuario._id;

        const imagenes = fileSystem.imagenesDeTempHaciaPost (req.usuario._id);
        body.imgs = imagenes;


        const postDB = await Post.create(body);

        await postDB.populate('usuario', '-password');

        res.json({
            ok: true,
            post: postDB
        });
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
});




//READ post paginado , añadir el token: postRoutes.get('/', [verificaToken], async (req: any, res: Response) => {
 postRoutes.get('/',  async (req: any, res: Response) => {

    /* _id -1 ordenar descendente, empezando por el último */

    /* skip para saltar registros */

    let pagina = Number(req.query.pagina) || 1;

    let skip = pagina - 1;

    skip = skip * 10;

    const posts = await Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();

    res.json({
        ok: true,
        pagina,
        posts


    });
});



// Servicio para subir archivos
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: FileUpload = req.files.image as UploadedFile

    if(!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - imagen'
        });
    }

    if(!file.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No me mandes cosas que no sean una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal(file, req.usuario._id);

    res.json({
        ok: true,
        mensaje: 'Imagen gestionada',
        file: file.mimetype

    })

});

postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img);

    res.sendFile( pathFoto);

});







export default postRoutes;
import { name } from "ejs";
import multer from "multer";

const multerConfig=multer.diskStorage({
    destination: (req,file, cb) =>{ // basicall cb is the callback function to set destination
        cb(null,'public/images');
    },
    filename: (req,file,cb)=>{ // cb is the callback function to set filename.
        const name=Date.now()+ '_'+file.originalname;
        cb(null,name)
    }
})

export const UploadFile=multer({ storage: multerConfig});
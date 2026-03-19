import multer from "multer";
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'



const uploadPath = path.join(process.cwd(),"uploads");
if (!fs.existsSync(uploadPath)) 
    fs.mkdirSync(uploadPath, { recursive: true })


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12,(err,bytes)=>{
        if(err) return cb(err);
        const fileName = bytes.toString("hex")+path.extname(file.originalname);
        cb(null, fileName);
    })
  }
})

const upload = multer({ storage: storage })
export {upload}
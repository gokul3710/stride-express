import multer, { StorageEngine } from 'multer';
import path from 'path';

const storage: StorageEngine = multer.diskStorage({
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const newFilename = `${timestamp}_${path.basename(file.originalname, ext)}.png`;
    cb(null, newFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB
})

export default upload;

import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'public/temp';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage });

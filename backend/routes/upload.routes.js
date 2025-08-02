import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router(); // ✅ Keep this one only

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  res.send({
    message: 'Image uploaded',
    image: `/uploads/${req.file.filename}`,
  });
});

export default router;

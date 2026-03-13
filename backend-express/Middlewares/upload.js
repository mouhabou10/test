// middleware/upload.js
import multer from 'multer';
import path from 'path';

// where to save the file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // all files will go into /uploads
  },
  filename: function (req, file, cb) {
    // rename file with current time + original name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer upload middleware
const upload = multer({ storage: storage });

export default upload;

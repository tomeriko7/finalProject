import express from 'express';
import { uploadSingle } from '../utils/fileUpload.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';

const router = express.Router();

// Upload a file
router.post('/', protect, admin, uploadSingle('image'), uploadFile);

// Delete a file
router.delete('/:filename', protect, admin, deleteFile);

export default router;

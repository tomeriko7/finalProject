import asyncHandler from 'express-async-handler';
import path from 'path';
import { getFileUrl } from '../utils/fileUpload.js';

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private/Admin
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('אנא העלה קובץ תמונה');
  }

  const fileUrl = getFileUrl(req.file.filename);
  
  res.status(201).json({
    success: true,
    message: 'הקובץ הועלה בהצלחה',
    imageUrl: fileUrl,
    filename: req.file.filename
  });
});

// @desc    Delete a file
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
export const deleteFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  if (!filename) {
    res.status(400);
    throw new Error('שם הקובץ חסר');
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);
  
  try {
    const fs = await import('fs/promises');
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'הקובץ נמחק בהצלחה'
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404);
      throw new Error('הקובץ לא נמצא');
    }
    throw error;
  }
});

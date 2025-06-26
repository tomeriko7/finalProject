import asyncHandler from 'express-async-handler';
import path from 'path';
import { getFileUrl } from '../utils/fileUpload.js';
import logger from '../utils/logger.js';

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private/Admin
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    logger.warn('File upload attempt without file', {
      userId: req.user?._id,
      ip: req.ip
    });
    res.status(400);
    throw new Error('אנא העלה קובץ תמונה');
  }

  const fileUrl = getFileUrl(req.file.filename);
  
  logger.info('File uploaded successfully', {
    userId: req.user?._id,
    fileName: req.file.filename,
    fileSize: req.file.size,
    mimeType: req.file.mimetype
  });
  
  // Admin action logging
  if (req.user?.isAdmin) {
    logger.adminAction(req.user._id, 'upload_file', {
      fileName: req.file.filename,
      fileSize: req.file.size
    });
  }
  
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
    logger.warn('File delete attempt without filename', {
      userId: req.user?._id,
      ip: req.ip
    });
    res.status(400);
    throw new Error('שם הקובץ חסר');
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);
  
  try {
    const fs = await import('fs/promises');
    await fs.unlink(filePath);
    
    logger.info('File deleted successfully', {
      userId: req.user?._id,
      fileName: filename,
      filePath
    });
    
    // Admin action logging
    if (req.user?.isAdmin) {
      logger.adminAction(req.user._id, 'delete_file', {
        fileName: filename
      });
    }
    
    res.json({
      success: true,
      message: 'הקובץ נמחק בהצלחה'
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.warn('File not found during delete attempt', {
        userId: req.user?._id,
        fileName: filename,
        filePath
      });
      res.status(404);
      throw new Error('הקובץ לא נמצא');
    }
    
    logger.error('Error deleting file', {
      userId: req.user?._id,
      fileName: filename,
      filePath,
      error: error.message,
      stack: error.stack
    });
    
    throw error;
  }
});

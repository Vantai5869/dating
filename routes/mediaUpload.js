import express from 'express';
import mediaUpload from '../controllers/mediaUpload.js';

const router = express.Router();

router.post('/upload', mediaUpload.uploadToCloudinary);
export default router;

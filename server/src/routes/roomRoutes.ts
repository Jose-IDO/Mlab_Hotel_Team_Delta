import { Router, Request, Response } from 'express';
import { roomController } from '../controllers/roomController';
import { upload } from '../config/upload';
import cloudinary from '../config/cloudinary';
import { roomRepository } from '../repositories/roomRepository';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', roomController.getAllRooms.bind(roomController));
router.get('/:id', roomController.getRoomById.bind(roomController));
router.post('/', roomController.createRoom.bind(roomController));
router.put('/:id', roomController.updateRoom.bind(roomController));
router.patch('/:id/archive', roomController.archiveRoom.bind(roomController));
router.patch('/:id/restore', roomController.restoreRoom.bind(roomController));
router.delete('/:id', roomController.deleteRoom.bind(roomController));

// Image upload routes
router.post(
  '/:id/images',
  authenticate,
  requireRole(['super_admin', 'hotel_manager']),
  upload.array('images', 10), // Max 10 images at once
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ ok: false, error: 'No files uploaded' });
        return;
      }

      // Check if room exists
      const room = await roomRepository.findById(id);
      if (!room) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      // Upload each file to Cloudinary
      const uploadPromises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'hotel-rooms',
              resource_type: 'image',
              transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve(result!.secure_url);
              }
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);

      // Add new URLs to existing images
      const updatedRoom = await roomRepository.addImages(id, uploadedUrls);

      res.json({ ok: true, data: updatedRoom });
    } catch (error: any) {
      console.error('Image upload error:', error);
      res.status(500).json({ ok: false, error: error.message || 'Failed to upload images' });
    }
  }
);

// Delete a specific image from a room
router.delete(
  '/:id/images',
  authenticate,
  requireRole(['super_admin', 'hotel_manager']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        res.status(400).json({ ok: false, error: 'Image URL is required' });
        return;
      }

      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/cloud-name/image/upload/v123456/hotel-rooms/room-uuid.jpg
      const urlParts = imageUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      
      if (uploadIndex === -1) {
        res.status(400).json({ ok: false, error: 'Invalid Cloudinary URL' });
        return;
      }

      // Get the path after 'upload/v{version}/'
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, ''); // Remove extension

      // Delete from Cloudinary
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue even if Cloudinary delete fails (image might already be deleted)
      }

      // Remove URL from database
      const updatedRoom = await roomRepository.removeImage(id, imageUrl);

      if (!updatedRoom) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      res.json({ ok: true, data: updatedRoom });
    } catch (error: any) {
      console.error('Image delete error:', error);
      res.status(500).json({ ok: false, error: error.message || 'Failed to delete image' });
    }
  }
);

export default router;
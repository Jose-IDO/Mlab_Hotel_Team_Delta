import { Router } from 'express';
import { roomController } from '../controllers/roomController';
import { authenticate, requireRole } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();

router.get('/:id/reviews', roomController.getRoomReviews.bind(roomController));
router.post('/:id/reviews', roomController.addRoomReview.bind(roomController));
router.get('/', roomController.getAllRooms.bind(roomController));
router.get('/:id', roomController.getRoomById.bind(roomController));
router.post('/', roomController.createRoom.bind(roomController));
router.put('/:id', roomController.updateRoom.bind(roomController));
router.patch('/:id/archive', roomController.archiveRoom.bind(roomController));
router.patch('/:id/restore', roomController.restoreRoom.bind(roomController));
router.delete('/:id', roomController.deleteRoom.bind(roomController));

// Images management
router.post(
	'/:id/images',
	authenticate,
	requireRole(['admin', 'super_admin']),
	upload.array('images', 10),
	roomController.uploadImages.bind(roomController)
);

router.delete(
	'/:id/images',
	authenticate,
	requireRole(['admin', 'super_admin']),
	roomController.deleteImage.bind(roomController)
);


export default router;
import { Router } from 'express';
import { roomController } from '../controllers/roomController';

const router = Router();

router.get('/:id/reviews', roomController.getRoomReviews.bind(roomController));
router.get('/', roomController.getAllRooms.bind(roomController));
router.get('/:id', roomController.getRoomById.bind(roomController));
router.post('/', roomController.createRoom.bind(roomController));
router.put('/:id', roomController.updateRoom.bind(roomController));
router.patch('/:id/archive', roomController.archiveRoom.bind(roomController));
router.patch('/:id/restore', roomController.restoreRoom.bind(roomController));
router.delete('/:id', roomController.deleteRoom.bind(roomController));


export default router;
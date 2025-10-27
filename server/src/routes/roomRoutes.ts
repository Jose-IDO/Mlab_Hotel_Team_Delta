import { Router } from 'express';
import { roomController } from '../controllers/roomController';

const router = Router();

router.get('/', roomController.getAllRooms.bind(roomController));
router.get('/:id', roomController.getRoomById.bind(roomController));
router.post('/', roomController.createRoom.bind(roomController));
router.put('/:id', roomController.updateRoom.bind(roomController));
router.delete('/:id', roomController.deleteRoom.bind(roomController));

export default router;
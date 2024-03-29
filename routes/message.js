import express from 'express';
import messageController from '../controllers/message.js';
import participantController from '../controllers/participant.js';
import roomController from '../controllers/room.js';

const router = express.Router();

// get friend recently ; chi lay ra nhung user chat gan day khong lay nhom. 
router.get('/recent/users/:userId/:page/:limit',participantController.getRoomIdsByPage, messageController.getRecentUsers);

// get messages of room
router.get('/rooms/:roomId/:page/:limit', messageController.getMessagesByRoomId);

// get last messages by userId; lay ra tat danh sach phong kem tin nhan cuoi
router.get('/users/:userId/:page/:limit',participantController.getRoomIdsByPage, messageController.getMessagesByUserId);
router.get('/:page/:limit', messageController.getByPage);
router.get('/:id', messageController.getOne);
router.post('/',roomController.checkExist,participantController.createMultiple,messageController.create);
router.put('/:id', messageController.update);
router.delete('/:id', messageController.remove);

export default router;

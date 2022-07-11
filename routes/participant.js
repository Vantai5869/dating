import express from 'express';
import participantController from '../controllers/participant.js';

const router = express.Router();

// lay tat ca id cua nguoi dung trong 1 room 
router.get('/participants-of-room/:roomId', participantController.ParticipantsOfRoom);

// lay 1 mang roomid cua người dùng theo trang
router.get('/:userId/:page/:limit', participantController.getRoomIdsByPage);
router.get('/:page/:limit', participantController.getByPage);
router.get('/:id', participantController.getOne);
router.post('/', participantController.create);
router.put('/:id', participantController.update);
router.delete('/:id', participantController.remove);



export default router;

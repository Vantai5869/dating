import express from 'express';
import roomController from '../controllers/room.js';

const router = express.Router();

router.get('/:page/:limit', roomController.getByPage);
router.get('/:id', roomController.getOne);
router.post('/', roomController.create);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.remove);

export default router;

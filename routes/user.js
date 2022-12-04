import express from 'express';
// import auth from "../middlewares/auth.js"
import userController from"../controllers/user.js"

const router = express.Router();
// router.get('/test',(req, res)=>{
//   res.send('hello api')
// })

// router.post('/', userCtrl.register);
// router.post('/login', userCtrl.login);
// router.get('/all', userCtrl.getAll)

// router.get('/search', auth, userCtrl.searchUser)

// router.get('/user/:id', auth, userCtrl.getUser)

// router.patch('/user', auth, userCtrl.updateUser)

// router.patch('/user/:id/follow', auth, userCtrl.follow)
// router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)

// router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)
// router.put('/:id', userCtrl.updateUser);
// router.get('/:id', userCtrl.getUser);



//================================================================
// get getRecommend


router.get('/auth/validate', userController.validateToken);
router.get('/:page/:limit', userController.getByPage);
router.get('/', userController.getAllUsers);
router.post('/', userController.register);
router.post('/active', userController.updateActiveUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.delete('/', userController.deleteAll);
router.post('/login', userController.login);

export default  router;
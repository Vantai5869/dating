import express from 'express';
import auth from "../middlewares/auth.js"
import userCtrl from"../controllers/user.js"

const router = express.Router();
router.get('/test',(req, res)=>{
  res.send('hello api')
})

router.post('/', userCtrl.register);

router.get('/all', userCtrl.getAll)

router.get('/search', auth, userCtrl.searchUser)

router.get('/user/:id', auth, userCtrl.getUser)

router.patch('/user', auth, userCtrl.updateUser)

router.patch('/user/:id/follow', auth, userCtrl.follow)
router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)

router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)



export default  router;
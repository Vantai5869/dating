import express from 'express';
import postCtrl from '../controllers/post.js'
import auth from '../middlewares/auth.js'

const router = express.Router();
router.route('/posts')
    .post(auth, postCtrl.createPost)
    .get(auth, postCtrl.getPosts)

router.patch('/post/:id/like', auth, postCtrl.likePost)

router.patch('/post/:id/unlike', auth, postCtrl.unLikePost)

router.get('/post_discover', auth, postCtrl.getPostsDicover)

export default  router;
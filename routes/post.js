const router = require('express').Router()
const postCtrl = require('../controllers/post')
const auth = require('../middlewares/auth')

router.route('/posts')
    .post(auth, postCtrl.createPost)
    .get(auth, postCtrl.getPosts)

router.patch('/post/:id/like', auth, postCtrl.likePost)

router.patch('/post/:id/unlike', auth, postCtrl.unLikePost)

router.get('/post_discover', auth, postCtrl.getPostsDicover)

module.exports = router
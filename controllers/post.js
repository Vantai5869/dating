import Posts from"../models/post.js"

class APIfeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    paginating() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 9;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
}

const postCtrl = {
    createPost: async (req, res) => {
      try {
        const { content, images } = req.body;
  
        if (images.length === 0)
          return res.status(400).json({ msg: "Please add your photo." });
  
        const newPost = new Posts({
          content,
          images,
          user: req.user._id,
        });
        await newPost.save();
  
        res.json({
          msg: "Created Post!",
          newPost: {
            ...newPost._doc,
            user: req.user,
          },
        });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    getPosts: async (req, res) => {
      try {
        const features = new APIfeatures(
          Posts.find({
            user: [...req.user.following, req.user._id],
          }),
          req.query
        ).paginating();
  
        const posts = await features.query
          .sort("-createdAt")
          .populate("user likes", "avatar username followers");
  
        res.json({
          msg: "Success!",
          result: posts.length,
          posts,
        });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    
    likePost: async (req, res) => {
      try {
        const post = await Posts.find({
          _id: req.params.id,
          likes: req.user._id,
        });
        if (post.length > 0)
          return res.status(400).json({ msg: "You liked this post." });
  
        const like = await Posts.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: { likes: req.user._id },
          },
          { new: true }
        );
  
        if (!like)
          return res.status(400).json({ msg: "This post does not exist." });
  
        res.json({ msg: "Liked Post!" });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    unLikePost: async (req, res) => {
      try {
        const like = await Posts.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: { likes: req.user._id },
          },
          { new: true }
        );
  
        if (!like)
          return res.status(400).json({ msg: "This post does not exist." });
  
        res.json({ msg: "UnLiked Post!" });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    
    getPostsDicover: async (req, res) => {
      try {
        const newArr = [...req.user.following, req.user._id];
  
        const num = req.query.num || 9;
  
        const posts = await Posts.aggregate([
          { $match: { user: { $nin: newArr } } },
          { $sample: { size: Number(num) } },
        ]);
  
        return res.json({
          msg: "Success!",
          result: posts.length,
          posts,
        });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
};
  
export default postCtrl;
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import signJWT from "../functions/signJTW.js";
import UserModel from "../models/user.js";

const NAMESPACE = "User";
import Users from "../models/user.js";

const userCtrl = {
  getAll: async (req, res) => {
    let ageCond = { $gte: 0, $lte: 100 };
    if (req.query.minAge && res.query.maxAge) {
      (ageCond.$gte = req.query.minAge), (ageCond.$lte = req.query.maxAge);
    }

    try {
      const users = await Users.find({
        $and: [{ age: ageCond }],
      });

      res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("username avatar");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { avatar, username, mobile, address, story, website, gender } =
        req.body;
      if (!username)
        return res.status(400).json({ msg: "Please add your full name." });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          username,
          mobile,
          address,
          story,
          website,
          gender,
        }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0)
        return res.status(500).json({ msg: "You followed this user." });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      ).populate("followers following", "-password");

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      ).populate("followers following", "-password");

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 10;

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //================================================================

  validateToken: (req, res) => {
    logging.info(NAMESPACE, "Token validated, user authorized.");

    return res.status(200).json({
      success: true,
      message: "Token(s) validated",
    });
  },

  register: async (req, res) => {
    if (!req.body.username || !req.body.password)
      return res.status(400).json({
        success: false,
        message: "username|password field not found",
      });

    let { phone, password, ...rest } = req.body;
    bcryptjs.hash(password, 10, (hashError, hash) => {
      if (hashError) {
        return res.status(401).json({
          message: hashError.message,
          error: hashError,
        });
      }

      const _user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        ...rest,
        phone,
        password: hash,
      });

      return _user
        .save()
        .then((user) => {
          signJWT(user, (_error, token) => {
            if (_error) {
              return res.status(500).json({
                message: _error.message,
                error: _error,
              });
            } else if (token) {
              return res.status(201).json({
                success: true,
                user,
                token,
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            message: error.message,
            error,
          });
        });
    });
  },

  login: async (req, res) => {
    if ((!req.body.email && !req.body.phone) || !req.body.password)
      return res.status(400).json({
        success: false,
        message: "email|phone|password field not found",
      });
    let { email, phone, password } = req.body;
    try {
      let users;
      if (email) {
        users = await UserModel.find({ email });
        if (users.length !== 1) {
          users = await UserModel.find({ phone });
        }
      } else {
        users = await UserModel.find({ phone });
      }
      if (users) {
        if (users?.length !== 1) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized",
          });
        }
        if (users[0].isBlock == true) {
          return res.status(401).json({
            success: false,
            message: "Blocked",
          });
        }

        bcryptjs.compare(password, users[0].password, (error, result) => {
          if (error) {
            return res.status(401).json({
              success: false,
              message: "Password Mismatch",
            });
          } else if (result) {
            signJWT(users[0], (_error, token) => {
              if (_error) {
                return res.status(500).json({
                  success: false,
                  message: _error.message,
                  error: _error,
                });
              } else if (token) {
                return res.status(200).json({
                  success: true,
                  message: "Auth successful",
                  token: token,
                  user: {
                    _id: users[0]._id,
                    email: users[0].email,
                    username: users[0].username,
                    avatar: users[0].avatar,
                    active: users[0].active,
                  },
                });
              }
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Password Mismatch",
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find().select("-password");
      if (users) {
        return res.status(200).json({
          success: true,
          users: users,
          count: users.length,
        });
      }
      return res.status(400);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
  deleteAll: async (req, res) => {
    try {
      const usersDie = await UserModel.deleteMany({});
      if (usersDie)
        return res.status(200).json({
          success: true,
          message: `Deleted ${usersDie.deletedCount} !`,
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id).select("-password");
      if (user)
        return res.status(200).json({
          success: true,
          data: user,
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
  updateUser: async (req, res) => {
    if (req.body.password) {
      if (!req.body.newPassword) {
        return res.status(401).json({
          success: false,
          error: "update password not successful!",
        });
      }
      const user = await UserModel.findOne({ _id: req.params.id });
      bcryptjs.compare(req.body.password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({
            success: false,
            message: "Password Mismatch",
          });
        } else if (result) {
          bcryptjs.hash(req.body.newPassword, 10, (hashError, hash) => {
            if (!hashError) {
              user.password = hash;
              user.save();
              return res.status(200).json({
                success: true,
                message: "Cập nhật mật khẩu thành công!",
              });
            } else {
              return res.status(401).json({
                message: hashError.message,
                error: hashError,
              });
            }
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Mật khẩu không đúng!",
          });
        }
      });
    } else {
      try {
        const user = await UserModel.findByIdAndUpdate(
          { _id: req.params.id },
          req.body
        );
        if (user) {
          return res.status(200).json({
            success: true,
            message: `Updated  !`,
            data: user,
          });
        }
        return res.status(200).json({
          message: `Cannot find!`,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
          error,
        });
      }
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userDie = await UserModel.findByIdAndDelete(req.params.id);
      if (userDie)
        return res.status(200).json({
          success: true,
          message: `Deleted ${userDie.email} !`,
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
  getByPage: async (req, res) => {
    const pageOptions = {
      page: +req.params.page || 0,
      limit: +req.params.limit || 10,
    };
    let searchOption = {};
    if (req.query.search && req.query.search != "") {
      searchOption = {
        username: { $regex: req.query.search, $options: "i" },
      };
    }
    let ageCond = {};
    let genderCond = {};
    let except = [""];
    if (+req.query?.minAge && +req.query?.maxAge) {
      ageCond = {
        yearBirth: {
          $gte: new Date().getFullYear() - req.query?.maxAge,
          $lte: new Date().getFullYear() - req.query?.minAge,
        },
      };
    }
    if (req.query?.gender) {
      if (req.query?.gender === "male") {
        genderCond = { gender: "male" };
      } else if (req.query?.gender === "female") {
        genderCond = { gender: "female" };
      }
    }
    try {
      const users = await Users.find(
        {
          ...searchOption,
          $and: [ageCond, genderCond],
          _id: { $ne: req.query?.except },
        },
        null,
        {
          sort: { _id: -1 },
          skip: pageOptions?.page * pageOptions?.limit,
          limit: pageOptions?.limit,
        }
      ).select("-password");

      res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }

    // let searchOption={}
    // if(req.query.search && req.query.search!=''){
    //     let y=req.query.search
    //     let x=y.slice(0,1)[0]
    //     if(x==0||x==8){
    //         searchOption ={
    //             phone: { $regex: req.query.search, $options:"i"}
    //         }
    //     }
    //     else{
    // searchOption ={
    //     username: { $regex: req.query.search, $options: "i" },
    // }
    //     }
    // }

    // const pageOptions = {
    //     page: +req.params.page || 0,
    //     limit: +req.params.limit || 10
    // }

    // try {
    //     const users= await UserModel.find(
    // searchOption,
    // null,
    // {
    //     sort:{_id:-1},
    //     skip:pageOptions?.page * pageOptions?.limit,
    //     limit:pageOptions?.limit
    // }).select('-password')
    //     if(!users){
    //         return res.status(500);
    //     }
    //     return  res.status(200).json({
    //             success:true,
    //             message: `get success`,
    //             data: users,
    //         })

    // } catch (error) {
    //     return res.status(500).json({
    //         success:false,
    //         message: 'get user not successful',
    //         error:error
    //     })
    // }
  },

  verify: async (userId) => {
    try {
      const userUpdate = await UserModel.findByIdAndUpdate(userId, {
        verify: true,
      });
      if (userUpdate) return true;
      else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  // friend

  getFriend: async (req, res) => {
    UserModel.find()
      .select("-password")
      .where("_id")
      .in(req.friends)
      .exec((err, records) => {
        res.json({ friends: records });
      });
  },

  checkFriend: async (req, res) => {
    let check = req.friends.includes(req.params.check_user_id);
    if (check) {
      res.json(true);
    } else {
      res.json(false);
    }
  },

  getFriendRequests: async (req, res) => {
    // console.log(req.friendRequests)
    UserModel.find()
      .select("-password")
      .where("_id")
      .in(req.friendRequests)
      .exec((err, records) => {
        res.json({ friends: records });
      });
  },

  getMyRequests: async (req, res) => {
    // console.log(req.friendRequests)
    UserModel.find()
      .select("-password")
      .where("_id")
      .in(req.myRequests)
      .exec((err, records) => {
        res.json({ friends: records });
      });
  },

  getRecommend: async (req, res) => {
    UserModel.find()
      .sort({ _id: -1 })
      .select("-password")
      .where("_id")
      .nin(req.friends)
      .limit(10)
      .exec((err, records) => {
        res.json({ users: records });
      });
  },
};

export default userCtrl;

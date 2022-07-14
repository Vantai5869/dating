import InterestModel from "../models/interest.js";

const interestCtrl = {
  getAllInterests: async (req, res) => {
    try {
      const interests = await InterestModel.find();
      if (interests) {
        return res.status(200).json({
          success: true,
          interests: interests,
          count: interests.length,
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
  create: async (req, res) => {
    let id = new mongoose.Types.ObjectId();
    if (req?.body?._id) {
      id = req.body._id;
    }
    const _interest = new InterestModel({
      _id: id,
      ...req.body,
    });
    try {
      const interest = await _interest.save();
      if (interest) {
        return res.status(201).json({
          success: true,
          message: "Create interest successful",
          data: interest,
        });
      }
      return res.status(404).json({
        success: false,
        message: "create interest not successful",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
};

export default interestCtrl;

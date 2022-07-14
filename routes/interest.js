import express from "express";
import interestController from "../controllers/interest.js";

const router = express.Router();

router.get("/", interestController.getAllInterests);
router.post("/", interestController.create);
// router.put("/:id", interestController.update);
// router.delete("/:id", interestController.remove);

export default router;

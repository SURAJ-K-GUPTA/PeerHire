const express = require("express");
const { loginUserController, registerUserController, userDetailsController } = require("../controllers/user");
const { verifyToken, verifyEmployer } = require("../utils/Auth");

const userRouter = express.Router();


userRouter.get("/user", verifyToken, verifyEmployer, userDetailsController);
userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);


module.exports = userRouter;
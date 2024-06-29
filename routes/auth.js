const express = require("express");
const { reqPassLimiter } = require("../middleware/requestPasswordLimiter");
const router = express.Router();

const {
  signUp,
  signIn,
  requestResetPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/request-reset-password", reqPassLimiter, requestResetPassword);
router.post("/reset-password", resetPassword);
module.exports = router;

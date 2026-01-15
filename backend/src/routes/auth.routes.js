const express = require("express");
const { authRequired } = require("../middlewares/auth");
const ctrl = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", authRequired, ctrl.me);

module.exports = router;

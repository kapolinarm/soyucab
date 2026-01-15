const express = require("express");
const { authRequired } = require("../middlewares/auth");
const ctrl = require("../controllers/encuestas.controller");

const router = express.Router();

router.get("/", authRequired, ctrl.list);
router.post("/", authRequired, ctrl.create);

module.exports = router;

const express = require("express");
const { authRequired, requireSelfOrAdmin } = require("../middlewares/auth");
const ctrl = require("../controllers/personas.controller");

const router = express.Router();

router.get("/", authRequired, ctrl.list);
router.get("/:correo", authRequired, ctrl.getOne);
router.put("/:correo", authRequired, requireSelfOrAdmin("correo"), ctrl.update);

module.exports = router;

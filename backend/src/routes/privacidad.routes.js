const express = require("express");
const { authRequired, requireSelfOrAdmin } = require("../middlewares/auth");
const ctrl = require("../controllers/privacidad.controller");

const router = express.Router();

router.get("/:correo", authRequired, requireSelfOrAdmin("correo"), ctrl.getByCorreo);
router.put("/:correo", authRequired, requireSelfOrAdmin("correo"), ctrl.upsertMany);

module.exports = router;

const express = require("express");
const { authRequired } = require("../middlewares/auth");
const ctrl = require("../controllers/asistencias.controller");

const router = express.Router();

router.get("/", authRequired, ctrl.listByEvento);
router.post("/", authRequired, ctrl.upsert);

module.exports = router;

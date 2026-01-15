const express = require("express");
const { authRequired } = require("../middlewares/auth");
const ctrl = require("../controllers/reportes.controller");

const router = express.Router();

router.get("/crecimiento", authRequired, ctrl.crecimiento);
router.get("/interaccion", authRequired, ctrl.interaccion);
router.get("/grupos", authRequired, ctrl.grupos);
router.get("/eventos", authRequired, ctrl.eventos);
router.get("/egresados", authRequired, ctrl.egresados);

module.exports = router;

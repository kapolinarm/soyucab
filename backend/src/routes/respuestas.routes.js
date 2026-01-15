const express = require("express");
const { authRequired } = require("../middlewares/auth");
const ctrl = require("../controllers/respuestas.controller");

const router = express.Router();

router.get("/", authRequired, ctrl.listByEncuesta);
router.post("/", authRequired, ctrl.upsert);

module.exports = router;

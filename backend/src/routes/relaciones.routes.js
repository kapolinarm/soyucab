const express = require("express");
const { authRequired } = require("../middlewares/auth");
const ctrl = require("../controllers/relaciones.controller");

const router = express.Router();

router.get("/", authRequired, ctrl.listMine);
router.post("/", authRequired, ctrl.create);
router.put("/estado", authRequired, ctrl.changeEstado);

module.exports = router;

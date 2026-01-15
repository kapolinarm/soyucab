const express = require("express");
const { authRequired } = require("../middlewares/auth");
const ctrl = require("../controllers/membresias.controller");

const router = express.Router();

router.get("/:grupo", authRequired, ctrl.listByGrupo);
router.post("/join", authRequired, ctrl.join);
router.delete("/leave/:grupo", authRequired, ctrl.leave);

module.exports = router;

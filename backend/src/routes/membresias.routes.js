const router = require("express").Router();
const c = require("../controllers/membresias.controller");

router.get("/grupo/:grupo", c.listByGrupo);
router.post("/join", c.join);
router.delete("/leave/:grupo", c.leave);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/asistencias.controller");

router.get("/me", c.misAsistencias);
router.post("/inscribirse", c.inscribirse);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/relaciones.controller");

router.get("/", c.list);
router.post("/solicitar", c.solicitar);
router.post("/aceptar", c.aceptar);

module.exports = router;

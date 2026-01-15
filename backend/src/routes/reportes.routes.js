const router = require("express").Router();
const c = require("../controllers/reportes.controller");

router.get("/crecimiento", c.crecimiento);
router.get("/interaccion", c.interaccion);
router.get("/grupos", c.topGrupos);
router.get("/eventos", c.eventosAsistencia);
router.get("/egresados", c.egresadosGeo);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/eventos.controller");

router.get("/", c.list);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/encuestas.controller");

router.get("/", c.list);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/personas.controller");

router.get("/", c.list);
router.get("/me", c.me);
router.put("/me", c.updateMe);

module.exports = router;

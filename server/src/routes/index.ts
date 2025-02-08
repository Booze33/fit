const express = require("express");
const auth = require("./auth");

const router = express.Router();

// Mount all feature routes
router.use("/qr", auth);

module.exports = router;
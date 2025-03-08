const express = require("express");
const { strangerAdd, strangerUpdate, strangerList, strangerById, strangerHistory, inActiveStranger, removeStranger } = require("../controllers/stranger-controller");

const router = express.Router();

router.post("/add", strangerAdd);
router.post("/update/:id", strangerUpdate);
router.patch("/inactive/:id", inActiveStranger);
router.get("/list/:id", strangerList);
router.get("/:id", strangerById);
router.get("/history/:id", strangerHistory);
router.delete("/remove/:id", removeStranger);


module.exports = router;

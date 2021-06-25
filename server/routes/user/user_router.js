const { createUser, getUserByUserID, getUsers, updateUser, login } = require("./user_controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/join", createUser);
router.get("/alluser", checkToken, getUsers);
router.get("/:id", checkToken, getUserByUserID);
router.patch("/update", checkToken, updateUser);
router.post("/login", login);

module.exports = router;
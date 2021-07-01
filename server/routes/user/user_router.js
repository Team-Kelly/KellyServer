const { createUser, getUserByUserID, getUsers, updateUser, login, refresh } = require("./user_controller");
const router = require("express").Router();
const { checkAccessToken, checkRefreshToken } = require("../../auth/token_validation");

router.post("/join", createUser);
router.get("/alluser", checkAccessToken, getUsers);
router.get("/:id", checkAccessToken, getUserByUserID);
router.patch("/update", checkAccessToken, updateUser);
router.post("/login", login);
router.post("/refresh", checkRefreshToken, refresh);

module.exports = router;
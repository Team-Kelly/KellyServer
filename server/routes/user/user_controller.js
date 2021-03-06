const { create, getUserByUserID, getUsers, updateUser, getUserByID } = require("./user_service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.userpwd = hashSync(body.userpwd, salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    sucess: 0,
                    message: "Database connect error"
                });
            }
            return res.status(200).json ({
                sucess: 1,
                data: results
            });
        });
    },
    //특정 아이디로 가입 정보를 찾습니다
    getUserByUserID: (req, res) => {
        const id = req.params.id;
        getUserByUserID(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    sucess: 0,
                    message: "Record not Found"
                });
            }
            return res.json({
                sucess: 1,
                data: results
            });
        });
    },
    //모든 유저 정보를 가져옵니다
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                sucess: 1,
                data: results
            });
        });
    },
    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.userpwd = hashSync(body.userpwd, salt);
        updateUser(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Failed to update user"
                });
            }
            return res.json({
                success: 1,
                message: "updated successfully"
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        //입력한 id에 맞는 id와 pwd를 result에 가져옵니다
        getUserByID(body.userid, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Invalid ID or Password"
                });
            }

            //저장된 해시와 입력받은 pwd의 해시가 일치하는지 확인
            const result = compareSync(body.userpwd, results.userpwd);
            console.log("result", result)
            if (result) {
                results.userpwd = undefined;
                const jsontoken = sign({ result: results }, ""+process.env.JWT_Secret_Key, {
                    expiresIn: "1h"
                });
                return res.json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken
                });
            } else {
                return res.json({
                    success: 0,
                    message: "Invalid ID or Password"
                });
            }
        });
    },
}
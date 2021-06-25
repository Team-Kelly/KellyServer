const pool = require("../../config/mysql/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into user(userid, userpwd, email, username) values(?,?,?,?)`,
            [
                data.userid, data.userpwd, data.email, data.username
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUsers: callBack => {
        pool.query(
            `select * from user`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByUserID: (userid, callBack) => {
        pool.query(
            `select * from user where userid = ?`,
            [ userid ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    updateUser: (data, callBack) => {
        pool.query(
            `update user set userpwd = ?, email = ?, username = ? where userid = ?`,
            [
                data.userpwd, data.email, data.username, data.userid
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByID: (userid, callBack) => {
        pool.query(
            `select userid, userpwd from user where userid = ?`,
            [ userid ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
};
const spicedPg = require("spiced-pg");
const { dbuser, dbpass } = require("../secrets.json");

const db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`);

exports.getInfo = function() {
    return db.query(`SELECT firstname, lastname FROM users`);
};

exports.addSignature = function(sign, userId) {
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1, $2)`,
        [sign, userId]
        // [firstName || null, lastName || null, sign || null] is it's underfined it not gonna put in the table
    );
    // .then(({ rows }) => {
    //     return rows[0].id;
    // });
};

exports.getSignature = function(id) {
    return db
        .query(`SELECT signature FROM signatures WHERE user_id = $1`, [id])
        .then(({ rows }) => {
            return rows[0].signature;
        });
};

exports.addUser = function(firstName, lastName, email, hashedPsw) {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstName || null, lastName || null, email || null, hashedPsw || null]
    );
};

exports.getPassword = function(email) {
    return db
        .query(`SELECT password FROM users WHERE email = $1`, [email])
        .then(({ rows }) => {
            return rows[0].password;
        });
};

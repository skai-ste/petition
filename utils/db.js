const spicedPg = require("spiced-pg");
const { dbuser, dbpass } = require("../secrets.json");

const db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`);

exports.getInfo = function() {
    return db.query(`SELECT firstname, lastname FROM petition`);
};

exports.addSignature = function(firstName, lastName, sign) {
    return db
        .query(
            `INSERT INTO petition (signature, user_id) VALUES ($1, $2, $3) RETURNING id`,
            [firstName, lastName, sign]
            // [firstName || null, lastName || null, sign || null] is it's underfined it not gonna put in the table
        )
        .then(({ rows }) => {
            return rows[0].id;
        });
};

exports.getSignature = function(id) {
    return db
        .query(`SELECT signature FROM petition WHERE user_id = $1`, [id])
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

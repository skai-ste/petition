const spicedPg = require("spiced-pg");
const { dbuser, dbpass } = require("./secrets.json");

const db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`);

exports.getInfo = function() {
    return db.query(`SELECT firstname, lastname FROM petition`);
};

exports.addSignature = function(firstName, lastName, sign) {
    return db
        .query(
            `INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING id`,
            [firstName, lastName, sign]
            // [firstName || null, lastName || null, sign || null] is it's underfined it not gonna put in the table
        )
        .then(({ rows }) => {
            return rows[0].id;
        });
};

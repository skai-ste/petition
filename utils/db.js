const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets.json");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`);
}

exports.getInfo = function() {
    return db.query(
        `
        SELECT signatures.user_id, firstname, lastname, age, city, url
        FROM signatures
        LEFT JOIN users
        ON users.id = signatures.user_id
        LEFT JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id`
    );
};

// WHERE LOWER(city) = LOWER($1)`,
// [city]

//  WE NEED TO CLEAN THE USER INPUT.
// i.e. str  = "hello"
// str.startsWith("he") -> true

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
            return rows[0];
        });
};

exports.addUser = function(firstName, lastName, email, hashedPsw) {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstName, lastName, email, hashedPsw]
    );
};

exports.getPassword = function(email) {
    return db
        .query(`SELECT password, id FROM users WHERE email = $1`, [email])
        .then(({ rows }) => {
            return rows[0];
            // return rows[0].password;
        });
};

exports.addUserProfile = function(age, city, homePage, userId) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [age || null, city || null, homePage || null, userId || null]
    );
};

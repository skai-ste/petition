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

exports.getCityInfo = function(city) {
    return db.query(
        `
        SELECT signatures.user_id, firstname, lastname, age, city, url
        FROM signatures
        LEFT JOIN users
        ON users.id = signatures.user_id
        LEFT JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id
        WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

exports.getUserProfileInfo = function(userId) {
    return db
        .query(
            `
        SELECT user_profiles.user_id, firstname, lastname, email, password, age, city, url
        FROM user_profiles
        JOIN users
        ON users.id = user_profiles.user_id
        WHERE (user_profiles.user_id) = ($1)`,
            [userId]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateUserProfileData = function(userId, userData, hashedPsw) {
    // console.log("USER DATA: ", userData);
    if (hashedPsw) {
        hashedPsw
            .then(password => {
                return db.query(
                    `
                UPDATE users SET password = $2 WHERE id = $1
                `,
                    [userId, password]
                );
            })
            .catch(err => {
                console.log("ERROR PASSWORD :", err);
            });
    }
    return Promise.all([
        db.query(
            `
            UPDATE users SET firstname = $2, lastname = $3, email = $4 WHERE id = $1
            `,
            [
                userId,
                userData.firstname,
                userData.lastname,
                userData.emailaddress
            ]
        ),
        db.query(
            `
            INSERT INTO user_profiles (user_id, age, city, url)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id)
            DO UPDATE SET age = $2, city = $3, url = $4;
            `,
            [
                userId,
                userData.age || null,
                userData.city || null,
                userData.url || null
            ]
        )
    ]);
};

exports.addSignature = function(sign, userId) {
    return db
        .query(
            `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING id`,
            [sign, userId]
            // [firstName || null, lastName || null, sign || null] is it's underfined it not gonna put in the table
        )
        .then(({ rows }) => {
            return rows[0].id;
        });
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

exports.addUserProfile = function(age, city, url, userId) {
    const sanitizedUrl = sanitize(url);
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [age || null, city || null, sanitizedUrl || null, userId || null]
    );
};

function sanitize(url) {
    if (
        url == null ||
        url == "" ||
        url.startsWith("http://") ||
        url.startsWith("https://")
    ) {
        return url;
    } else {
        return "https://" + url;
    }
}

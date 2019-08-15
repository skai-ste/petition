const spicedPg = require("spiced-pg");
const { dbuser, dbpass } = require("./secrets.json");

const db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/cities`);

exports.getCities = function() {
    return db.query(`SELECT id, city AS "cityName" FROM cities`);
};

exports.addCity = function(cityName, country, pop) {
    return db
        .query(
            `INSERT INTO cities (city, country, population) VALUES ($1, $2, $3) RETURNING id`,
            [cityName, country, pop]
        )
        .then(({ rows }) => {
            return rows[0].id;
        });
};

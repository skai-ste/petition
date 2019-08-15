const db = require("./db");

db.addCity("Mexico City", "Mexico", 21000000)
    .then(id => {
        console.log(id.rows);
        return db.getCities();
    })
    .then(function({ rows }) {
        // console.log(result.rows.map(obj => obj.cityName));
        console.log(rows);
    });

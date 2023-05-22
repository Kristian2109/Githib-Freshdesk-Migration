require("dotenv").config();

const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASS,
    database: "nodesql"
});

function runDatabase() {
    return new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) {
                console.log(err.message);
                reject(false);
            }
            else {
                console.log("Database running");
                resolve(true);
            }
        }); 
    }) 
}

function contains(user) {
    const query = `Select * from contacts where login = "${user.login}"`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.log(err.message)
                reject(err);
            }
            
            resolve((result.length > 0) ? true : false);
        });
    })
}

function createUser(user) {
    const onlyDate = user.created_at.substring(0, 10);
    const query = `Insert into contacts set login = "${user.login}", creation_date="${onlyDate}", name="${user.name}"`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}

function updateUser(user) {
    const query = `Update contacts set login = "${user.login}", name="${user.name}"`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}

async function updateOrCreateUserMySql(user) {
    await runDatabase();

    const isUserCreated = await contains(user);

    if (isUserCreated) {
        await updateUser(user);
    } else {
        await createUser(user);
    }

    console.log("Contact data updated in the database!");
}

module.exports = {
    updateOrCreateUserMySql
}

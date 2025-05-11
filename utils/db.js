const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const { hashPassword, verifyPassword } = require('./password.js');
const dbPath = path.join(__dirname, '../', 'site.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the database.');
    }
});

var getDbPath = function() {
    return dbPath;
}


var verifyUser = function(username, password) {
    // Use async/await to handle the asynchronous nature of SQLite queries
    // This function will return a promise that resolves when the query is complete
    // and the user is verified or not.
    // The function will return "User verified:" if the user is found and the password matches,
    // "Invalid password" if the password does not match, and "User not found" if the user does not exist.
    // The function will also log the result to the console.
    // The function will also log any errors that occur during the query.
    // The function will also log the user object if the user is found.
    // Return a promise to handle async behavior
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
            if (err) {
                console.error('Error querying database 2 ' + err.message);
                reject(err);
            } else {
                if (row) {
                    const match = await verifyPassword(password, row.password, row.salt);
                    if (match) {
                        console.log('User verified:', row);
                        resolve("User verified:");
                    } else {
                        console.log('Invalid password');
                        resolve("Invalid password");
                    }
                } else {
                    console.log('User not found');
                    resolve("User not found");
                }
            }
        });
    });
}


var createTableUsers = function() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            salt TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table ' + err.message);
            } else {
                console.log('Users table created or already exists.');
            }
        });
    });
}

var insertUser = function(username, password) {
    db.serialize(() => {
        var hashed = hashPassword(password, false).then((hashed) => {
            // Use the hashed password and salt to insert into the database
            const stmt = db.prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)");
            stmt.run(username, hashed.hashedPassword, hashed.salt);
            stmt.finalize();
        });
    });
}

var queryUsers = function() {
    db.serialize(() => {
        db.all("SELECT * FROM users", [], (err, rows) => {
            if (err) {
                console.error('Error querying database ' + err.message);
            } else {
                console.log('Users:', rows);
            }
        });
    });
}

var closeDB = function() {
    db.close((err) => {
        if (err) {
            console.error('Error closing database ' + err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}

// Export the database connection
module.exports = {
    db,
    createTableUsers,
    verifyUser,
    insertUser,
    queryUsers,
    closeDB,
    getDbPath
};

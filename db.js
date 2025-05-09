const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const { v4: uuidv4 } = require('uuid');
 const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}

const dbPath = path.join(__dirname, './', 'site.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the database.');
    }
});


var verifyUser = function(username, password) {
    db.serialize(() => {
        console.log('Verifying user:', username);
        db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
            if (err) {
                console.error('Error querying database ' + err.message);
            } else {
                if (row) {
                    const match = await verifyPassword(password, row.password);
                    if (match) {
                        console.log('User verified:', row);
                        return false;
                    } else {
                        console.log('Invalid password');
                        return "Invalid password";
                    }
                } else {
                    console.log('User not found');
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
            password TEXT NOT NULL
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
        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, hashPassword(password));
        stmt.finalize();
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
    closeDB
};

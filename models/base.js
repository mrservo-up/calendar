const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db.js').db;

class BaseModel {
    constructor() {
        this.id = null;
        this.date_created = null;
    }

    tableName() {
        return "";
    }

    insert() {
        return new Promise((resolve, reject) => {
            var keys = Object.keys(this);
            keys.shift(); // Remove the first key (id)
            var values = Object.values(this);
            values.shift(); // Remove the first value (id)
            var placeholders = keys.map(() => '?').join(', ');
            var sql = `INSERT INTO ${this.tableName()} (${keys.join(', ')}) VALUES (${placeholders})`;
            console.log("SQL: " + sql);
            console.log("Values: " + values);
            db.run(sql, values, function(err) {
                if (err) {
                    console.error('Error inserting record:', err.message);
                    reject(err.message);
                } else {
                    console.log('Record inserted with ID:', this.lastID);
                    resolve(this.id);
                }
            });
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            var keys = Object.keys(this);
            var values = Object.values(this);
            var setClause = keys.map(key => `${key} = ?`).join(', ');
            var sql = `UPDATE ${this.tableName()} SET ${setClause} WHERE id = ?`;
            console.log("SQL: " + sql);
            console.log("Values: " + values);
            db.serialize(() => {
                db.run(sql, [...values, this.id], function(err) {
                    if (err) {
                        console.error('Error updating record:', err.message);
                        reject(err);
                    } else {
                        console.log('Record updated with ID:', this.id);
                        resolve(this.id);
                    }
                });
            });
        });
    }

    delete() {
        console.log("Deleting record with ID: " + this.id);
        var sql = `DELETE FROM ${this.tableName()} WHERE id = ?`;
        console.log("SQL: " + sql);
        console.log("Values: " + [this.id]);
        db.serialize(() => {
            db.run(sql, [this.id], function(err) {
                if (err) {
                    console.error('Error deleting record:', err.message);
                } else {
                    console.log('Record deleted with ID:', this.changes);
                }
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            var sql = `SELECT * FROM ${this.tableName()}`;
            console.log("SQL: " + sql);
            db.serialize(() => {
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.error('Error querying database:', err.message);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT * FROM ${this.tableName()} WHERE id = ?`;
            console.log("SQL: " + sql);
            db.serialize(() => {
                db.get(sql, [id], (err, row) => {
                    if (err) {
                        console.error('Error querying database:', err.message);
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        });
    }

    getByField(field, value) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT * FROM ${this.tableName()} WHERE ${field} = ?`;
            console.log("SQL: " + sql);
            db.serialize(() => {
                db.all(sql, [value], (err, rows) => {
                    if (err) {
                        console.error('Error querying database:', err.message);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        });
    }

    save() {
        this.date_created = new Date();
        
        if (this.id !== null) {
            console.log("Updating record with ID: " + this.id);
            this.update().then((result) => {
                return result;
            });
        } else {
            console.log("Inserting new record");
            this.id = null;
            this.insert().then((result) => {
                this.id = result;
                return result;
            });
        }
    }
}

exports.BaseModel = BaseModel;
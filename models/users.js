const BaseModel = require('./base.js').BaseModel;

class User extends BaseModel {
    constructor() {
        super();
        this.username = null;
        this.password = null;
        this.salt = null;
    }
    
    tableName() {
        return "users";
    }

    save() {
        // Hash the password before saving
        const { hashPassword } = require('../utils/password.js');
        return hashPassword(this.password, this.salt).then((result) => {
            this.password = result.hashedPassword;
            this.salt = result.salt;
            super.save();
        });
    }
}

exports.User = User;

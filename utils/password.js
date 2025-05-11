const bcrypt = require('bcrypt');

async function hashPassword(password, salt) {
    if (!salt) {
        const saltRounds = 10;
        salt = await bcrypt.genSalt(saltRounds);
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    return {
        hashedPassword, 
        salt
    };
}

async function verifyPassword(password, hashedPassword, salt) {
    if (hashedPassword === (await hashPassword(password, salt)).hashedPassword) {
        return true;
    }
    return false;
}

exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
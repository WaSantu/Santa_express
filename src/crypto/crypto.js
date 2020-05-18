const crypto = require('crypto')
const config = require('../../config')
const crypto_code = (data,password=config.crypto_key) => {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

const crypto_decode = (data,password = config.crypto_key) => {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

module.exports = {
    crypto_code,
    crypto_decode
}
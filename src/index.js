const maxmind = require('maxmind');


const getInfo = async (request, response) => {
    try {
        maxmind.open('./GeoLite2-City.mmdb').then((db) => {
            const res = db.get('1.1.1.1');
            response.json(res);
        })
    } catch(e) {
        console.log(`ERR getInfo: ${e}`)
    }
};

module.exports = {
    getInfo
};

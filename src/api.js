import { open, validate } from 'maxmind'

const getInfo = (request, response) => {
    try {
        // TODO: add some token verification to restrict usage to token holders?
        if (!request.query.ip) throw new Error('Missing IP address')
        const ip = request.query.ip
        if (!validate(ip)) throw new Error('Not a valid IP address')

        open('./GeoLite2-City.mmdb').then((db) => {
            const res = db.get(ip)
            response.json(res)
        })
    } catch(e) {
        console.log(`ERR getInfo: ${e}`)
        response.status(400).json({error: e.message})
    }
}

export {
    getInfo
}

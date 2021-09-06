import { open, validate } from 'maxmind'
import  forwarded from 'forwarded'

const getInfo = (request, response) => {
    try {
        // TODO: add some token verification to restrict usage to token holders?
        const fwd = forwarded(request) // contains client IP if using proxies
        const ip = request.query.ip || fwd[fwd.length-1] || request.ip || request.ips[0]

        console.log(`request.query.ip: ${request.query.ip}`)
        console.log(`x-forwarded-for: ${JSON.stringify(fwd)}`)
        console.log(`request.ip      : ${request.ip}`)
        console.log(`request.ips[0]  : ${request.ips[0]}`)
        console.log(`final IP        : ${ip}`)

        if (!ip) throw new Error('Missing IP address (not found in request object nor as query param')
        if (!validate(ip)) throw new Error('Not a valid IP address')
        // TODO: better detection for ipv6 non-routable addresses ...
        if ('127.0.0.1' === ip || '::1' === ip || isPrivateIP(ip)) throw new Error('Non-routable IP address')
        open('./GeoLite2-City.mmdb').then((db) => {
            const res = db.get(ip)
            response.json(res)
        })
    } catch(e) {
        console.log(`ERR getInfo: ${e}`)
        response.status(400).json({error: e.message})
    }
}

const isPrivateIP = (ip) => {
    const parts = ip.split('.')
    return parts[0] === '10' || 
       (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || 
       (parts[0] === '192' && parts[1] === '168')
 };

export {
    getInfo
}

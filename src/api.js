import { open, validate } from 'maxmind'
import  forwarded from 'forwarded'


const getCountryInfo = (request, response) => {
    const countryDb = './GeoLite2-Country.mmdb'
    getInfo(request, response, countryDb)
}

const getCityInfo = (request, response) => {
    const cityDb = './GeoLite2-City.mmdb'
    getInfo(request, response, cityDb)
}

const getInfo = (request, response, database) => {
    try {
        const start = Date.now()
        const ip = getIP(request)
        open(database).then((db) => {
            const res = db.get(ip)
            sendInfo(response, res, ip, Date.now() - start)
        })
    } catch(e) {
        console.log(`ERR getInfo: ${e}`)
        response.status(400).json({error: e.message})
    }
}

const sendInfo = (response, res, ip, duration) => {
    try {
        response.json({data: res, ip, duration})
    } catch (e) {
        console.log(`ERR getInfo: ${e}`)
        response.status(400).json({error: e.message})
    }
}

const getIP = (request) => {
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
        return ip
    } catch (error) {
        throw error
    }
}

const isPrivateIP = (ip) => {
    const parts = ip.split('.')
    return parts[0] === '10' || 
       (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || 
       (parts[0] === '192' && parts[1] === '168')
 };

export {
    getCityInfo,
    getCountryInfo
}

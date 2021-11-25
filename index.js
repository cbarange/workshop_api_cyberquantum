require('dotenv').config()
// redis-server
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
// const redis = require('redis')
// Openapi Documentation
const openapi = require('openapi-comment-parser')
const swagger_ui = require('swagger-ui-express')
const { exec } = require("child_process");
const fs = require('fs')
const ASN1 = require('./lib/asn1.js')
const Base64 = require('./lib/base64.js')
const Hex = require('./lib/hex.js')
const bodyParser = require('body-parser')


// --- REDIS ---
// const db = redis.createClient({host:process.env.HOST_REDIS, port:process.env.PORT_REDIS,password:process.env.PASSWORD_REDIS})

// db.on('connect', () =>  console.log('Connected to Redis...') )
// --- === ---

var scoreboard = [{'name':'SopraSteria','score':1},{'name':'EPSI&Co','score':0},{'name':'CyberQuantumTeam','score':0}]

var numbers = [{'number':100183, 'find':[{'algo':'naive', 'time':0.0002040863037}]}, {'number':82371, 'find':[{'algo':'naive', 'time':0.0009214878}]}, {'number':2, 'find':[]},{'number':3, 'find':[]},{'number':5, 'find':[]},{'number':7, 'find':[]},{'number':11, 'find':[]},{'number':13, 'find':[]},{'number':17, 'find':[]},{'number':19, 'find':[]},{'number':23, 'find':[]},{'number':29, 'find':[]},{'number':31, 'find':[]},{'number':37, 'find':[]},{'number':41, 'find':[]},{'number':43, 'find':[]},{'number':47, 'find':[]},{'number':53, 'find':[]},{'number':59, 'find':[]},{'number':61, 'find':[]},{'number':67, 'find':[]},{'number':71, 'find':[]},{'number':73, 'find':[]},{'number':79, 'find':[]},{'number':83, 'find':[]},{'number':89, 'find':[]},{'number':97, 'find':[]},{'number':101, 'find':[]},{'number':103, 'find':[]},{'number':107, 'find':[]},{'number':109, 'find':[]},{'number':113, 'find':[]},{'number':127, 'find':[]},{'number':131, 'find':[]},{'number':137, 'find':[]},{'number':139, 'find':[]},{'number':149, 'find':[]},{'number':151, 'find':[]},{'number':157, 'find':[]},{'number':163, 'find':[]},{'number':167, 'find':[]},{'number':173, 'find':[]},{'number':179, 'find':[]},{'number':181, 'find':[]},{'number':191, 'find':[]},{'number':193, 'find':[]},{'number':197, 'find':[]},{'number':199, 'find':[]},{'number':211, 'find':[]},{'number':223, 'find':[]},{'number':227, 'find':[]},{'number':229, 'find':[]},{'number':233, 'find':[]},{'number':239, 'find':[]},{'number':241, 'find':[]},{'number':251, 'find':[]},{'number':257, 'find':[]},{'number':263, 'find':[]},{'number':269, 'find':[]},{'number':271, 'find':[]},{'number':277, 'find':[]},{'number':281, 'find':[]},{'number':283, 'find':[]},{'number':293, 'find':[]},{'number':307, 'find':[]},{'number':311, 'find':[]},{'number':313, 'find':[]},{'number':317, 'find':[]},{'number':331, 'find':[]},{'number':337, 'find':[]},{'number':347, 'find':[]},{'number':349, 'find':[]},{'number':353, 'find':[]},{'number':359, 'find':[]},{'number':367, 'find':[]},{'number':373, 'find':[]},{'number':379, 'find':[]},{'number':383, 'find':[]},{'number':389, 'find':[]},{'number':397, 'find':[]},{'number':401, 'find':[]},{'number':409, 'find':[]},{'number':419, 'find':[]},{'number':421, 'find':[]},{'number':431, 'find':[]},{'number':433, 'find':[]},{'number':439, 'find':[]},{'number':443, 'find':[]},{'number':449, 'find':[]},{'number':457, 'find':[]},{'number':461, 'find':[]},{'number':463, 'find':[]},{'number':467, 'find':[]},{'number':479, 'find':[]},{'number':487, 'find':[]},{'number':491, 'find':[]},{'number':499, 'find':[]},{'number':503, 'find':[]},{'number':509, 'find':[]},{'number':521, 'find':[]},{'number':523, 'find':[]},{'number':541, 'find':[]},{'number':547, 'find':[]},{'number':557, 'find':[]},{'number':563, 'find':[]},{'number':569, 'find':[]},{'number':571, 'find':[]},{'number':577, 'find':[]},{'number':587, 'find':[]},{'number':593, 'find':[]},{'number':599, 'find':[]},{'number':601, 'find':[]},{'number':607, 'find':[]},{'number':613, 'find':[]},{'number':617, 'find':[]},{'number':619, 'find':[]},{'number':631, 'find':[]},{'number':641, 'find':[]},{'number':643, 'find':[]},{'number':647, 'find':[]},{'number':653, 'find':[]},{'number':659, 'find':[]},{'number':661, 'find':[]},{'number':673, 'find':[]},{'number':677, 'find':[]},{'number':683, 'find':[]},{'number':691, 'find':[]},{'number':701, 'find':[]},{'number':709, 'find':[]},{'number':719, 'find':[]},{'number':727, 'find':[]},{'number':733, 'find':[]},{'number':739, 'find':[]},{'number':743, 'find':[]},{'number':751, 'find':[]},{'number':757, 'find':[]},{'number':761, 'find':[]},{'number':769, 'find':[]},{'number':773, 'find':[]},{'number':787, 'find':[]},{'number':797, 'find':[]},{'number':809, 'find':[]},{'number':811, 'find':[]},{'number':821, 'find':[]},{'number':823, 'find':[]},{'number':827, 'find':[]},{'number':829, 'find':[]},{'number':839, 'find':[]},{'number':853, 'find':[]},{'number':857, 'find':[]},{'number':859, 'find':[]},{'number':863, 'find':[]},{'number':877, 'find':[]},{'number':881, 'find':[]},{'number':883, 'find':[]},{'number':887, 'find':[]},{'number':907, 'find':[]},{'number':911, 'find':[]},{'number':919, 'find':[]},{'number':929, 'find':[]},{'number':937, 'find':[]},{'number':941, 'find':[]},{'number':947, 'find':[]},{'number':953, 'find':[]},{'number':967, 'find':[]},{'number':971, 'find':[]},{'number':977, 'find':[]},{'number':983, 'find':[]},{'number':991, 'find':[]},{'number':997, 'find':[]},{'number':1009, 'find':[]},{'number':1013, 'find':[]},{'number':1019, 'find':[]},{'number':1021, 'find':[]},{'number':1031, 'find':[]},{'number':1033, 'find':[]},{'number':1039, 'find':[]},{'number':1049, 'find':[]},{'number':1051, 'find':[]},{'number':1061, 'find':[]},{'number':1063, 'find':[]},{'number':1069, 'find':[]},{'number':1087, 'find':[]},{'number':1091, 'find':[]},{'number':1093, 'find':[]},{'number':1097, 'find':[]},{'number':1103, 'find':[]},{'number':1109, 'find':[]},{'number':1117, 'find':[]},{'number':1123, 'find':[]},{'number':1129, 'find':[]},{'number':1151, 'find':[]},{'number':1153, 'find':[]},{'number':1163, 'find':[]},{'number':1171, 'find':[]},{'number':1181, 'find':[]},{'number':1187, 'find':[]},{'number':1193, 'find':[]},{'number':1201, 'find':[]},{'number':1213, 'find':[]},{'number':1217, 'find':[]},{'number':1223, 'find':[]},{'number':1229, 'find':[]},{'number':1231, 'find':[]},{'number':1237, 'find':[]},{'number':1249, 'find':[]},{'number':1259, 'find':[]},{'number':1277, 'find':[]},{'number':1279, 'find':[]},{'number':1283, 'find':[]},{'number':1289, 'find':[]},{'number':1291, 'find':[]},{'number':1297, 'find':[]},{'number':1301, 'find':[]},{'number':1303, 'find':[]},{'number':1307, 'find':[]},{'number':1319, 'find':[]},{'number':1321, 'find':[]},{'number':1327, 'find':[]},{'number':1361, 'find':[]},{'number':1367, 'find':[]},{'number':1373, 'find':[]},{'number':1381, 'find':[]},{'number':1399, 'find':[]},{'number':1409, 'find':[]},{'number':1423, 'find':[]},{'number':1427, 'find':[]},{'number':1429, 'find':[]},{'number':1433, 'find':[]},{'number':1439, 'find':[]},{'number':1447, 'find':[]},{'number':1451, 'find':[]},{'number':1453, 'find':[]},{'number':1459, 'find':[]},{'number':1471, 'find':[]},{'number':1481, 'find':[]},{'number':1483, 'find':[]},{'number':1487, 'find':[]},{'number':1489, 'find':[]},{'number':1493, 'find':[]},{'number':1499, 'find':[]},{'number':1511, 'find':[]},{'number':1523, 'find':[]},{'number':1531, 'find':[]},{'number':1543, 'find':[]},{'number':1549, 'find':[]},{'number':1553, 'find':[]},{'number':1559, 'find':[]},{'number':1567, 'find':[]},{'number':1571, 'find':[]},{'number':1579, 'find':[]},{'number':1583, 'find':[]},{'number':1597, 'find':[]},{'number':1601, 'find':[]},{'number':1607, 'find':[]},{'number':1609, 'find':[]},{'number':1613, 'find':[]},{'number':1619, 'find':[]},{'number':1621, 'find':[]},{'number':1627, 'find':[]},{'number':1637, 'find':[]},{'number':1657, 'find':[]},{'number':1663, 'find':[]},{'number':1667, 'find':[]},{'number':1669, 'find':[]},{'number':1693, 'find':[]},{'number':1697, 'find':[]},{'number':1699, 'find':[]},{'number':1709, 'find':[]},{'number':1721, 'find':[]},{'number':1723, 'find':[]},{'number':1733, 'find':[]},{'number':1741, 'find':[]},{'number':1747, 'find':[]},{'number':1753, 'find':[]},{'number':1759, 'find':[]},{'number':1777, 'find':[]},{'number':1783, 'find':[]},{'number':1787, 'find':[]},{'number':1789, 'find':[]},{'number':1801, 'find':[]},{'number':1811, 'find':[]},{'number':1823, 'find':[]},{'number':1831, 'find':[]},{'number':1847, 'find':[]},{'number':1861, 'find':[]},{'number':1867, 'find':[]},{'number':1871, 'find':[]},{'number':1873, 'find':[]},{'number':1877, 'find':[]},{'number':1879, 'find':[]},{'number':1889, 'find':[]},{'number':1901, 'find':[]},{'number':1907, 'find':[]},{'number':1913, 'find':[]},{'number':1931, 'find':[]},{'number':1933, 'find':[]},{'number':1949, 'find':[]},{'number':1951, 'find':[]},{'number':1973, 'find':[]},{'number':1979, 'find':[]},{'number':1987, 'find':[]},{'number':1993, 'find':[]},{'number':1997, 'find':[]},{'number':1999, 'find':[]},{'number':2003, 'find':[]},{'number':2011, 'find':[]},{'number':2017, 'find':[]},{'number':2027, 'find':[]},{'number':2029, 'find':[]},{'number':2039, 'find':[]},{'number':2053, 'find':[]},{'number':2063, 'find':[]},{'number':2069, 'find':[]},{'number':2081, 'find':[]},{'number':2083, 'find':[]},{'number':2087, 'find':[]},{'number':2089, 'find':[]},{'number':2099, 'find':[]},{'number':2111, 'find':[]},{'number':2113, 'find':[]},{'number':2129, 'find':[]},{'number':2131, 'find':[]},{'number':2137, 'find':[]},{'number':2141, 'find':[]},{'number':2143, 'find':[]},{'number':2153, 'find':[]},{'number':2161, 'find':[]},{'number':2179, 'find':[]},{'number':2203, 'find':[]},{'number':2207, 'find':[]},{'number':2213, 'find':[]},{'number':2221, 'find':[]},{'number':2237, 'find':[]},{'number':2239, 'find':[]},{'number':2243, 'find':[]},{'number':2251, 'find':[]},{'number':2267, 'find':[]},{'number':2269, 'find':[]},{'number':2273, 'find':[]},{'number':2281, 'find':[]},{'number':2287, 'find':[]},{'number':2293, 'find':[]},{'number':2297, 'find':[]},{'number':2309, 'find':[]},{'number':2311, 'find':[]},{'number':2333, 'find':[]},{'number':2339, 'find':[]},{'number':2341, 'find':[]},{'number':2347, 'find':[]},{'number':2351, 'find':[]},{'number':2357, 'find':[]},{'number':2371, 'find':[]},{'number':2377, 'find':[]},{'number':2381, 'find':[]},{'number':2383, 'find':[]},{'number':2389, 'find':[]},{'number':2393, 'find':[]},{'number':2399, 'find':[]},{'number':2411, 'find':[]},{'number':2417, 'find':[]},{'number':2423, 'find':[]},{'number':2437, 'find':[]},{'number':2441, 'find':[]},{'number':2447, 'find':[]},{'number':2459, 'find':[]},{'number':2467, 'find':[]},{'number':2473, 'find':[]},{'number':2477, 'find':[]},{'number':2503, 'find':[]},{'number':2521, 'find':[]},{'number':2531, 'find':[]},{'number':2539, 'find':[]},{'number':2543, 'find':[]},{'number':2549, 'find':[]},{'number':2551, 'find':[]},{'number':2557, 'find':[]},{'number':2579, 'find':[]},{'number':2591, 'find':[]},{'number':2593, 'find':[]},{'number':2609, 'find':[]},{'number':2617, 'find':[]},{'number':2621, 'find':[]},{'number':2633, 'find':[]},{'number':2647, 'find':[]},{'number':2657, 'find':[]},{'number':2659, 'find':[]},{'number':2663, 'find':[]},{'number':2671, 'find':[]},{'number':2677, 'find':[]},{'number':2683, 'find':[]},{'number':2687, 'find':[]},{'number':2689, 'find':[]},{'number':2693, 'find':[]},{'number':2699, 'find':[]},{'number':2707, 'find':[]},{'number':2711, 'find':[]},{'number':2713, 'find':[]},{'number':2719, 'find':[]},{'number':2729, 'find':[]},{'number':2731, 'find':[]},{'number':2741, 'find':[]},{'number':2749, 'find':[]},{'number':2753, 'find':[]},{'number':2767, 'find':[]},{'number':2777, 'find':[]},{'number':2789, 'find':[]},{'number':2791, 'find':[]},{'number':2797, 'find':[]},{'number':2801, 'find':[]},{'number':2803, 'find':[]},{'number':2819, 'find':[]},{'number':2833, 'find':[]},{'number':2837, 'find':[]},{'number':2843, 'find':[]},{'number':2851, 'find':[]},{'number':2857, 'find':[]},{'number':2861, 'find':[]},{'number':2879, 'find':[]},{'number':2887, 'find':[]},{'number':2897, 'find':[]},{'number':2903, 'find':[]},{'number':2909, 'find':[]},{'number':2917, 'find':[]},{'number':2927, 'find':[]},{'number':2939, 'find':[]},{'number':2953, 'find':[]},{'number':2957, 'find':[]},{'number':2963, 'find':[]},{'number':2969, 'find':[]},{'number':2971, 'find':[]},{'number':2999, 'find':[]},{'number':3001, 'find':[]},{'number':3011, 'find':[]},{'number':3019, 'find':[]},{'number':3023, 'find':[]},{'number':3037, 'find':[]},{'number':3041, 'find':[]},{'number':3049, 'find':[]},{'number':3061, 'find':[]},{'number':3067, 'find':[]},{'number':3079, 'find':[]},{'number':3083, 'find':[]},{'number':3089, 'find':[]},{'number':3109, 'find':[]},{'number':3119, 'find':[]},{'number':3121, 'find':[]},{'number':3137, 'find':[]},{'number':3163, 'find':[]},{'number':3167, 'find':[]},{'number':3169, 'find':[]},{'number':3181, 'find':[]},{'number':3187, 'find':[]},{'number':3191, 'find':[]},{'number':3203, 'find':[]},{'number':3209, 'find':[]}]

// --- CORS ---
var CORS_OPTION = {
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: true, // default is false
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// --- === ---



const get_pubkey = async (domain, port) => {
  new Promise((resolve, reject) => {exec(`openssl s_client -connect ${domain}:${port} | openssl x509 -pubkey -noout > ${domain}_${port}.txt `, (error, stdout, stderr) => resolve)})
  let cpt=0
  let file_done = true
  let pubkey = ""
  while(cpt<5 || !pubkey.startsWith("-----BEGIN PUBLIC KEY-----")){
    cpt++
    await new Promise(r => setTimeout(r, 500))
    const buffer = fs.readFileSync(`${domain}_${port}.txt`)
    pubkey = buffer.toString()
  }
  return pubkey
}


function RSAModulusAndExponent(pubkey) {
  var unarmor = /-----BEGIN PUBLIC KEY-----([A-Za-z0-9+\/=\s]+)-----END PUBLIC KEY-----/;
  try{
    var pubkeyAsn1 = ASN1.decode(Base64.decode(unarmor.exec(pubkey)[1]));
    var modulusRaw = pubkeyAsn1.sub[1].sub[0].sub[0];
    var modulusStart = modulusRaw.header + modulusRaw.stream.pos + 1;
    var modulusEnd = modulusRaw.length + modulusRaw.stream.pos + modulusRaw.header;
    var modulusHex = modulusRaw.stream.hexDump(modulusStart, modulusEnd);
    // var modulus = Hex.decode(modulusHex)
    let hex = JSON.stringify(modulusHex).replace(/\\n| |"/g,'')
    
    if (hex.length % 2) { hex = '0' + hex }
    return BigInt('0x' + hex).toString(10)
  }
  catch(err){ console.log(err)
    return "Failed validating RSA public key."
  }
}



// --- EXPRESS ---
const app = express()
app.enable('trust proxy')
app.use(helmet())
app.use(morgan('common'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
// app.use(express.bodyParser())
app.options('*', cors())
app.use('/docs', swagger_ui.serve, swagger_ui.setup(openapi()))




/**
 * GET /numbers/notfound
 * @summary Returns numbers not found
 * @response 200 - OK
 */
app.get('/numbers/notfound', cors(CORS_OPTION), async (req, res) => {  
  res.json(numbers.reduce((r,v)=>v.find.length==0?[...r,v.number]:r,[]))
})

/**
 * GET /numbers
 * @summary Returns numbers
 * @response 200 - OK
 */
app.get('/numbers', cors(CORS_OPTION), async (req, res) => {  
  res.json(numbers)
})

/**
 * PUT /numbers/found/:number/:time/:algo/:user
 * @summary Returns numbers
 * @response 200 - OK
 */
app.put('/numbers/found/:number/:time/:algo/:user', cors(CORS_OPTION), async (req, res) => {  
  let number = numbers.find(e=>parseInt(e.number)==parseInt(req.params.number))
  if(number==undefined)
    res.json("Number not found")
  else {
    number.find.push({'time':req.params.time, 'algo':req.params.algo})
    scoreboard.find(e=>e.name==req.params.user).score+=number.number
    res.json(number)
  }
})

/**
 * GET /modulus/:domain/:port
 * @summary Returns a modulus of SSL certificate present on domain:port
 * @response 200 - OK
 */
app.get('/modulus/:domain/:port', cors(CORS_OPTION), async (req, res) => {
  // http://localhost:5225/modulus/cyberquantum.methaverse.fr/443
  pubkey = await get_pubkey(req.params.domain,req.params.port)
  if(pubkey==""){
    return "Error occurred, please check domain and port"
  }

  const modulus = RSAModulusAndExponent(pubkey)
  res.json(modulus)
})


/**
 * GET /pubkey
 * @summary Returns a modulus of key
 * @response 200 - OK
 */
app.post('/pubkey', cors(CORS_OPTION), async (req, res) => {
  const modulus = RSAModulusAndExponent(req.body.key)
  res.json(modulus)
})


// - HOME -
/**
 * GET /
 * @summary Returns a helloworld string 
 * @response 200 - OK
 */
app.get('/', cors(CORS_OPTION), async (req, res) => {
  res.json('Welcome on CyberQuantum API')
})



/**
 * GET /leaderboard
 * @summary Returns sorted array leaderboad  
 * @description Returns sorted array leaderboad  
 * @response 200 - OK
 */
app.get('/leaderboard', cors(CORS_OPTION), async (req, res, next) => {
  //ZREVRANGE scoreboard 0 -1 WITHSCORES
  // const redis_output = await new Promise((resv, rej) => db.ZREVRANGE(`scoreboard`, 0, -1, "WITHSCORES", (err, data) => err? next(err): resv(data)))
  // res.json(redis_output.reduce((r, v, i, a) => i%2==0?[...r, {'name':a[i],'score':a[i+1]}]:r, []))
  res.json(scoreboard)
})


// - POST -
/**
 * POST /searcher/{id}
 * @summary Returns 1 after insert searcher
 * @response 200 - OK
 */
app.post('/searcher/:id', cors(CORS_OPTION), async (req, res, next) => {
  // ZADD scoreboard 1 SopraSteria
  // const new_searcher_in_leaderboard = await new Promise((resv, rej) => db.ZADD(`scoreboard`, 0, req.params.id, (err, data) => err? next(err): resv(data)))
  scoreboard.push({'name':req.params.id,'score':0})
  res.json(scoreboard)
})

/**
 * PUT /searcher/{id}/{point}
 * @summary Add 
 * @response 200 - OK
 */
app.put('/searcher/:id/:point', cors(CORS_OPTION), async (req, res, next) => {
  // ZINCRBY scoreboard 2 SopraSteria
  // const redis_output = await new Promise((resv, rej) => db.ZINCRBY(`scoreboard`, parseInt(req.params.point), req.params.id, (err, data) => err? next(err): resv(data)))
  // res.json(redis_output)
  scoreboard.find(e=>e.name==req.params.id).score+= parseInt(req.params.point)
  res.json(scoreboard)
})


// - ERROR -
app.use((req, res, next) => res.status(404))

app.use((error, req, res, next) => {
  error.status ? res.status(error.status) : res.status(500)
  res.json({
    message: error.message,
    stack: process.env.ENVIRONMENT === 'production' ? '🥞' : error.stack,
  })
})

// - RUN -
const port = process.env.PORT || 5225
app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
// --- === ---
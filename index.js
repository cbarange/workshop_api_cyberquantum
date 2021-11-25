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
var numbers = require('./numbersjson.json');
const Hex = require('./lib/hex.js')
const bodyParser = require('body-parser')


// --- REDIS ---
// const db = redis.createClient({host:process.env.HOST_REDIS, port:process.env.PORT_REDIS,password:process.env.PASSWORD_REDIS})

// db.on('connect', () =>  console.log('Connected to Redis...') )
// --- === ---

var scoreboard = [{'name':'SopraSteria','score':1},{'name':'EPSI&Co','score':0},{'name':'CyberQuantumTeam','score':0}]



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
    res.json(scoreboard.find(e=>e.name==req.params.user).score)
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
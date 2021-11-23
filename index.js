require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const redis = require('redis')
// Openapi Documentation
const openapi = require('openapi-comment-parser')
const swagger_ui = require('swagger-ui-express')



// --- REDIS ---
const db = redis.createClient({host:process.env.HOST_REDIS, port:process.env.PORT_REDIS/*,password:process.env.PASSWORD_REDIS*/})

db.on('connect', () =>  console.log('Connected to Redis...') )
// --- === ---


// --- CORS ---
var CORS_OPTION = {
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: true, // default is false
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// --- === ---


// --- EXPRESS ---
const app = express()
app.enable('trust proxy')
app.use(helmet())
app.use(morgan('common'))
app.use(express.json())
app.options('*', cors())
app.use('/docs', swagger_ui.serve, swagger_ui.setup(openapi()))

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
  const redis_output = await new Promise((resv, rej) => db.ZREVRANGE(`scoreboard`, 0, -1, "WITHSCORES", (err, data) => err? next(err): resv(data)))
  res.json(redis_output.reduce((r, v, i, a) => i%2==0?[...r, {'name':a[i],'score':a[i+1]}]:r, []))
})


// - POST -
/**
 * POST /searcher/{id}
 * @summary Returns 1 after insert searcher
 * @response 200 - OK
 */
app.post('/searcher/:id', cors(CORS_OPTION), async (req, res, next) => {
  // ZADD scoreboard 1 SopraSteria
  const new_searcher_in_leaderboard = await new Promise((resv, rej) => db.ZADD(`scoreboard`, 0, req.params.id, (err, data) => err? next(err): resv(data)))
  res.json(new_searcher_in_leaderboard)
})

/**
 * PUT /searcher/{id}/{point}
 * @summary Add 
 * @response 200 - OK
 */
app.put('/searcher/:id/:point', cors(CORS_OPTION), async (req, res, next) => {
  // ZINCRBY scoreboard 2 SopraSteria
  const redis_output = await new Promise((resv, rej) => db.ZINCRBY(`scoreboard`, parseInt(req.params.point), req.params.id, (err, data) => err? next(err): resv(data)))
  res.json(redis_output)
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
const express = require('express')
const app = express()
const cors = require('cors');
const http = require("http");

const AuthFilter = require('./MiddleWare/AuthFilter');
const AuthRouter = require('./Controller/AuthRouter');
const PrivateRouter = require('./Controller/PrivateRouter');
const RuletServer = require('./Service/Rulet/RuletServer');

const server = http.createServer(app);

app.use(cors());

RuletServer(server);

app.use(express.json());
app.use('/api',AuthFilter,PrivateRouter)
app.use('/authapi',AuthRouter);

app.listen(8484, () => {
    console.log(`Example app listening`)
})
app.get("/",(req,res)=>{res.send("ssss")})

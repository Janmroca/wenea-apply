const IP = "localhost"
const PORT = 3000

const express = require("express")
const bodyParser = require("body-parser")

const routes = require("./routes/index.js")(express)
const app = express()

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}));
app.use(routes);


app.listen(PORT, (res) => {
    console.log(`Server started at ${IP}:${PORT}`)
})

module.exports = app
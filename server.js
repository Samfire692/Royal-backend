const express = require('express');
const cors = require('cors');
const db = require("./database/database")
require('dotenv').config();

const app = express();
const PORT = process.env.PORT
const auth_routes = require("./router/authrouter");
const stu_routes = require("./router/studentauthrouter");
const teach_routes = require("./router/teacherauthrouter");

app.use(cors({
  origin: ["http://localhost:4000", "https://royal-frontend-lime.vercel.app"],
  credentials: true
}))

app.use(express.json());
app.use('/api/authrouter', auth_routes);
app.use('/api/studentauthrouter', stu_routes);
app.use("/api/teacherauthrouter", teach_routes);

app.get("/" , (req,res)=> {
    res.send("app running")
})

app.listen(PORT, ()=> {
    console.log(`listening on port http://127.0.0.1:${PORT}`)
})

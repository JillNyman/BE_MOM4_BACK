const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require("./routes/authRoutes"); //<--
const jwt = require("jsonwebtoken");
const cors = require('cors');
require('dotenv').config;

const app = express();
app.use(cors());
const port = process.env.PORT || 3552;
app.use(bodyParser.json());

//Routes
app.use("/api", authRoutes);


//Protected routes
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({message: "Skyddad route!"});
});

//Validate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Token

    if(token == null) {
        return res.status(401).json({message: "Not authorized - token missing!"});
        //console.log("Token missing");
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if(err){ 
            return res.status(403).json({message: "Unvalid JWT"});
           
    };
        console.log("Lyckat!");
        req.username = username;        
        next();
    });
}

//Starta applikation
app.listen(port, () => {
    console.log(`Servern startad på http://localhost:${port}`);
})











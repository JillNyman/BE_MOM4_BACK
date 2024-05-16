//Routes för autentisering


const express = require('express');
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors');
require("dotenv").config();


//Connect to database
const db = new sqlite3.Database(process.env.DATABASE);



//Add new user
router.post("/register", async(req, res) =>{
    try{
        let username = req.body.username;
        let password = req.body.password;

        //validate input
        if(!username || !password) {
            return res.status(400).json({error: "Invalid input, send username and password"});
        }

        //Hash password 
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //Check if user already exists

        //Correct - save user
        const sql = `INSERT INTO users(username, password) VALUES(?, ?)`;
        db.run(sql, [username, hashedPassword], (err) => {
            if(err){
                res.status(400).json({ message: "Error creating user"});
            } else {
                res.status(201).json({message: "User created"});
            }
        });
        

    } catch (error) {
        res.status(500).json({error: "Server error"});
    }
    
});

//login user
router.post("/login", (req, res) => {
    try{
        //const {username, password} = req.body;
        let username = req.body.username;
        let password = req.body.password;

        console.log("Tagit emot: " + username + " " + password);

        //validate input
        if(!username || !password) {
            return res.status(400).json({error: "Invalid input, send username and password"});
        }
    
       //Check if user exists
       const sql = `SELECT * FROM users WHERE username=?`;
       db.get(sql, [username], async (err, row) => {
        if(err){
            res.status(400).json({message: "Error authenticating..."});
        } else if(!row) {
            res.status(401).json({message: "Incorrect username/password!"});
        } else {
            //User exists
            console.log("Användaren finns");
            const passwordMatch = await bcrypt.compare(password, row.password);

            if(!passwordMatch) {
                res.status(401).json({message: "Incorrect username/password"});
            } else {
                //Create JWT
                const payload = {username: row.username}; // <----
                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
                const response = {
                    message: "User logged in!",
                    token: token
                }
                res.status(200).json({response});
                console.log("Skickat token: " + token);
            }
        }
       });

    } catch (error) {
        res.status(500).json({error: "Server error"});
    }       
    
});

module.exports = router;


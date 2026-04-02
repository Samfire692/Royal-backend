const express = require('express');
const Tearoutes = express.Router();
const db = require("../database/database");

Tearoutes.post("/signup", async(req,res)=> {
    try{
      const {fullname, email, password} = req.body;

      const {data, error:authError} = await db.auth.signUp({
        email,
        password
      })

      if(authError) return res.status(400).json({error:authError.message});

     const {error:tableError} = await db.from("teachersignup")
     .insert({
        id:data.user.id,
        fullname,
        email
     })

     if(tableError) return res.status(400).json({error:tableError.message});

     res.status(201).json({message:"Account created successfully, please check your email for confirmation!"});

    }catch(error) {return res.status(500).json({error:error.message})}
})

module.exports= Tearoutes;
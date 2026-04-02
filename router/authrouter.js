const express = require('express');
const route = express.Router();
const db = require("../database/database");

route.post("/signup", async(req,res)=> {
    try{
      const {fullname, email, password} = req.body;

      const {data, error:authError} = await db.auth.signUp({
        email,
        password
      })

      if(authError) return res.status(400).json({error:authError.message});

     const {error:tableError} = await db.from("royalsignup")
     .insert({
        id:data.user.id,
        fullname,
        email
     })

     if(tableError) return res.status(400).json({error:tableError.message});

     res.status(201).json({message:"Account created successfully, please check your email for confirmation!"});

    }catch(error) {return res.status(500).json({error:error.message})}
})

route.post("/login", async(req, res)=>{
  try{
     const {email, password}= req.body;
     const {data:authData, error} = await db.auth.signInWithPassword({
       email,
       password
     })

     if(error) {

        if(error.message == "Email not confirmed"){
         res.status(400).json({error:"Check your email for Confirmation"})
         return;
      }

        return res.status(400).json({error:error.message});
    }

   const {data:tableData} = await db.from("royalsignup")
       .select("*")
       .eq("id", authData.user.id)
       .single()
      

      res.json({
        message:"Login Successful",
        user:{
            id:tableData.id,
            email:tableData.email,
            name:tableData.name
        },
        session:authData.session
      })

   }catch(error){return res.status(500).json({error:error.message})}
})

route.get('/stats', async (req, res) => {
  try {
    const { count: stuCount } = await db.from("studentsignup").select("*", { count: 'exact', head: true });
    
    const { count: teaCount } = await db.from("teachersignup").select("*", { count: 'exact', head: true });

    const { count: admincount } = await db.from("royalsignup").select("*", { count: 'exact', head: true });

    res.json({ 
      totalStudents: stuCount || 0,
      totalTeachers: teaCount || 0, 
      totalAdmin: admincount || 0
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports= route;
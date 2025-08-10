import {generateToken} from "../middleware/jwtAuthMiddleware.js"
import userModel from "../models/userModel.js";
import express from "express";

const router = express.Router();

router.post("/", async (req,res)=>{
    try{
    const {name, password} = req.body;
    const user = await userModel.findOne({name: name});
    if(!user || !(await user.comparePassword(password))) return res.status(401).send("Incorrect username or password ");
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email

  }
  const token = await generateToken(payload);
  res.status(200).json(token);
} catch(err){
    console.log(err);
    res.status(500).send("Internal server Error");
}

})

export default router;
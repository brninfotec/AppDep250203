const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/profilePics', express.static('profilePics'));

require("dotenv").config();

// let authrize = (req,res,next)=>{
//  console.log(authrize)
//  console.log(req.headers['Authorization'])
// next();
// }

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    console.log(file)
    cb(null, 'profilePics')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage: storage });

app.post("/validateToken",upload.none(),async(req,res)=>{
  console.log(req.body);
  let decryptedCredintials = jwt.verify(req.body.token,"brninfotech");
  console.log(decryptedCredintials)
   let userArr = await user.find().and([{email:decryptedCredintials.email}]);
   if(userArr.length >0){
    if(userArr[0].password === decryptedCredintials.password){
     
      let dataToSend ={
       firstName: userArr[0].firstName,
       lastName: userArr[0].lastName,
       age: userArr[0].age,
       email: userArr[0].email,
       mobileNo: userArr[0].mobileNo,
       profilePic: userArr[0].profilePic,
      
       
      }
    res.json({status:"Success",msg:"credintials are correct",data:dataToSend})
    }else{
     res.json({status:"Failure",msg:"Invalid Password"}) 
    }
   }else{
    res.json({status:"Failure",msg:"user does not exist"})
   }
})

app.post("/login",upload.none(),async(req,res)=>{
  console.log(req.body);
   let userArr = await user.find().and([{email:req.body.email}]);
   if(userArr.length >0){
     let isValidPassword = await bcrypt.compare(req.body.password,userArr[0].password);

    if(isValidPassword === true){
      let token = jwt.sign({email:req.body.email,password:req.body.password},"brninfotech")
      let dataToSend ={
       firstName: userArr[0].firstName,
       lastName: userArr[0].lastName,
       age: userArr[0].age,
       email: userArr[0].email,
       mobileNo: userArr[0].mobileNo,
       profilePic: userArr[0].profilePic,
       token:token
       
      }
    res.json({status:"Success",msg:"credintials are correct",data:dataToSend})
    }else{
     res.json({status:"Failure",msg:"Invalid Password"}) 
    }
   }else{
    res.json({status:"Failure",msg:"user does not exist"})
   }
})

app.post("/signup",upload.single("profilePic"),async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    let hashedPassword = await bcrypt.hash(req.body.password,10)
   try{
    let newUser = new user({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    age:req.body.age,
    email:req.body.email,
    password:hashedPassword,
    mobileNo:req.body.mobileNo,
    profilePic:req.file.path
    });
    console.log("Successfully inserting the data into DB")
    await user.insertMany([newUser]);
    res.json({status:"success",msg:"account is created successfully"})
    }catch(err){
        console.log("Unable to inserting the data into DB");
        res.json({status:"failure",msg:"unable to create account"})
    }
});

app.patch("/editProfile",upload.single("profilePic"),async(req,res)=>{
  try{
   if(req.body.firstName.trim().length> 0){
   await user.updateMany({email:req.body.email},
                      {firstName:req.body.firstName});
  }
  if(req.body.lastName.trim().length> 0){
   await user.updateMany({email:req.body.email},
                      {lastName:req.body.lastName});
  }
  if(req.body.age.trim().length> 0){
   await user.updateMany({email:req.body.email},
                      {age:req.body.age});
  }
  if(req.body.password.trim().length> 0){
   await user.updateMany({email:req.body.email},
                      {password:req.body.password});

  }if(req.body.mobileNo.trim().length> 0){
   await user.updateMany({email:req.body.email},
                      {mobileNo:req.body.mobileNo});
  }
  if(req.file){
   await user.updateMany({email:req.body.email},
                      {profilePic:req.file.path});
  }
  res.json({status:"success",msg:"account updated Successfully"})
  }catch(err){
    res.json({status:"failure",msg:"Unable to update"})
  }
  
});

app.delete("/deleteProfile",upload.none(),async(req,res)=>{
let deleteResult  =   await user.deleteMany({email:req.body.email});
if(deleteResult.deletedCount > 0){
 res.json({status:"Success",msg:"account is Deleted"})
}else{
  res.json({status:"Failure",msg:"Nothing is deleted"})
}
})

app.listen(process.env.PORT,()=>{
    console.log(`Listening to port ${process.env.PORT}`)
})

let userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    age:Number,
    email:String,
    password:String,
    mobileNo:Number,
    profilePic:String
});

let user = new mongoose.model("users",userSchema,"250203users");



let connectedToMDB = async ()=>{
   try{
    await mongoose.connect(process.env.MDBURL);
    console.log("Successfully connceted to MDB");
  
    
    }catch(err){
        console.log("Unable to connceted to MDB")
    }
}
connectedToMDB();
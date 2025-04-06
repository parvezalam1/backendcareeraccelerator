const express=require('express')
const dotevn=require('dotenv')
const cors=require('cors')
const app=express();
const mongoose=require('mongoose')
const PORT=process.env.PORT || 5000;
const User= require("./model/Users")
let bcrypted=require('bcrypt');

dotevn.config()
app.use(cors())
app.use(express.json())
const connect = () => {
    mongoose.connect(process.env.MONGOOSE_URL)
        .then(() => {
            console.log('Connected to DB!')
        })
        .catch((err) => {
            console.log(err)
        })
}

app.post('/register',async(req,res)=>{
    let salt= await bcrypted.genSalt(10);
let hashPass=await bcrypted.hash(req.body.password,salt);
try{
 
    let newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPass
    
    });
    await newUser.save();
    res.status(200).json("You Are Registerd!");
    
}
catch(err){
    res.status(500).json(err);
}
})


//login
app.post('/login',async (req,res)=>{
    // res.status(200).json({"message":"success","data":req.body})

try{
    // let user=await User.findOne({email:req.body.username})
    // res.status(200).json({"user data":user,"username":req.body.username})
    let user=await User.findOne({username:req.body.username})
    !user && res.status(401).json('Username is incurrect')
    let passwordValidate=await bcrypted.compare(req.body.password,user.password)
    !passwordValidate && res.status(401).json('Password is incurrect');
    const {password,...others}=user._doc;
    res.status(200).json(others)
    res.end();
}
catch(err){
    res.status(500).json(err)
}
})

app.listen(PORT,()=>{
    connect()
    console.log(`Server is running on port number ${PORT}`)
})
const express = require("express");
require('dotenv').config();
const {check,add,allData, latestNews ,deleteOne,newUser,latestSportsNews} = require("./mongo");
const bodyParser = require("body-parser")
const app = express();
const cors = require("cors");

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


//console.log(process.env.secret_key,process.env.MONGODB_URI);
var urlencodedParser = bodyParser.urlencoded({ extended: false }) ;

app.set("view engine","ejs");
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    
    res.render("./login")
})
app.post("/contact",(req,res)=>{
    res.redirect("/contact");
})
app.post("/check",urlencodedParser,async(req,res)=>{
    let userName = req.body.email;
    let password = req.body.password;
    if(await check(userName,password)){
        const t = jwt.sign({user:userName},process.env.secret_key);
        res.cookie('token', t, { httpOnly : true});
        console.log(res.cookie);
            res.redirect("./main");
    }
    else res.send("bad");


})

app.post("/signup",async (req,res)=>{
    const {name,email,password} = req.body;
    const status = await newUser(email,password);
    if(status==null)res.send("already here");
    const t = jwt.sign({user:email},process.env.secret_key);
    res.cookie('token', t, { httpOnly : true});
    console.log(res.cookie);
    res.redirect("./main");



})
app.get('/logout', (req, res) => {
    
    res.clearCookie('token');
    res.redirect('/')
  })
app.get("/main",middleware,(req,res)=>{
res.render("./main");
})

app.get('/items',middleware,async(req,res)=>{
    const data = await allData();
   
    res.render("./items",{data:data})
})
app.post("/add",middleware,urlencodedParser,async (req,res)=>{
    var obj = {
        'title':req.body.Title,
        'Discription':req.body.Discription,
        'url':req.body.url,
        'urlToImage':req.body.img,
        'published':req.body.published,
        'sports':req.body.sports

    }
    await add(obj);
    console.log(obj);
    res.redirect("/main");
})
async function middleware(req,res,nex){
    // const header = req.headers['authorization'];
    // let token = header && header.split(' ')[1];
   //  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaHNpbmdhbDIwMEBnbWFpbC5jb20iLCJpYXQiOjE3MDcxMjI1NTB9.-QjibOTGmacxh89IjHmYEwi5oFAyFZs657t4azBhBP8'
    let token = req.cookies.token;
    //console.log(token);
    const user = jwt.verify(token,process.env.secret_key,(err,user)=>{
        
            if (err) {
                console.log(err);
                res.redirect('/'); // Redirect to login page or handle accordingly
            } else {
                nex();
            }
        
        
    });
   
}
app.post("/delete",middleware,async(req,res)=>{
    console.log(req.body.delete);
    await deleteOne(req.body.delete);
    res.redirect("./items");
})
app.get("/getNews",async(req,res)=>{
    const data = await latestNews();
    res.json(data);
   
})
app.get("/getSportsNews",async(req,res)=>{
    const data = await latestSportsNews();
    res.json(data);
   
})
app.listen("3000",()=>{
    console.log("working on localhost:3000");
})


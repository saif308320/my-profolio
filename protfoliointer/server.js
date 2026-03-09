require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const xss = require('xss-clean');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname,'data','messages.json');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({limit:'300kb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(xss());
app.use(express.static(path.join(__dirname,'public')));

const limiter = rateLimit({windowMs:60000,max:10,message:{error:'Too many requests, wait a minute.'}});

app.post('/api/contact', limiter, async (req,res)=>{
  try{
    const {name,email,message}=req.body;
    if(!name||name.trim().length<2) return res.status(400).json({error:'Name must be at least 2 chars'});
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Valid email required'});
    if(!message||message.trim().length<10) return res.status(400).json({error:'Message must be 10+ chars'});

    const entry={id:Date.now(),name:name.trim(),email:email.trim(),message:message.trim(),ip:req.ip,ua:req.headers['user-agent'],ts:new Date().toISOString()};
    let arr=[];
    try{
      const raw=fs.readFileSync(DATA_FILE,'utf8');
      arr=JSON.parse(raw||'[]');
      if(!Array.isArray(arr)) arr=[];
    }catch(e){ arr=[]; }
    arr.unshift(entry);
    if(arr.length>200) arr=arr.slice(0,200);
    fs.writeFileSync(DATA_FILE,JSON.stringify(arr,null,2),'utf8');

    res.json({ok:true,message:'Message received. Thank you!'});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Server error'});
  }
});

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));

const dataDir = path.join(__dirname,'data');
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE,'[]','utf8');

app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));

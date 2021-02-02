const express=require('express');
const router=express.Router();
const defaultController=require("../controllers/defaultController");
const userController=require('../controllers/userController')

const auth = require('../middleware/auth');
var dbconn = require('./../config/config');
var request = require('request');
const nodemailer=require('nodemailer')

router.all('/*',(req,res,next)=>{
    req.app.locals.layouts='default';
    next();
})

router.route('/')
    .get(defaultController.index)

router.route('/register')
    .get(defaultController.register)
    .post(defaultController.postregister)

router.route('/login')
    .get(defaultController.login)
    .post(auth,defaultController.postlogin)
    
router.route('/user')
    .get(defaultController.getUser)
    .post(userController.createnewtask)
    .delete(userController.deletetask)
    .put(userController.updatetask)

router.route('/perfil/:id')
    .get(defaultController.seeconfig)
    .put(defaultController.updateconfing)

router.route('/logout')
    .get(defaultController.logout);


tick()
//LLAMA UNA VEZ LA FUNCIION
////////////////////////////////////////////////////////////////////////////////////////////////////// 
function tick(){
    var hours =new Date().getHours();
    var minutes=new Date().getMinutes();
    var seconds=new Date().getSeconds();
    const time=hours+':'+minutes+':'+seconds
    if(time=="16:10:0"){
        getremind()
    }
   
}
setInterval(tick,1000);


function getremind(){
    dbconn.query('SELECT * FROM activity',async function (err,result){
        var gettime=JSON.stringify(result);
        var alltime=JSON.parse(gettime)
        const objeto =alltime.map(a=>a.remind)
        
        const today=new Date();
        const yesterday= new Date(today)
        yesterday.setDate(yesterday.getDate()-1)

     
        var formatdate=yesterday.toISOString().slice(0,10)
        console.log(formatdate,"fecha actual")
        const listate=[];  
   
        for(i in objeto){
                const setact=new Date(objeto[i])
                setact.setDate(setact.getDate())
                var covertdate=setact.toISOString().slice(0,10)
                if(covertdate==formatdate) {
                listate.push(covertdate)
                    }
                }
                if (listate.length==0){
                    console.log("vacio")
                }else{
                    console.log("Lista a recordar",listate)
                    givemessage(listate) 
                    givewhatsapp(listate)
                }     
})
}

////////////////////////send to whassapp//////////////////////////////////////////////////////////////////// 
 function givewhatsapp([data]){
 
    let datesearch=new Date(data)
    datesearch.setDate(datesearch.getDate())

    const originaldate=datesearch.toISOString().slice(0,10)
    dbconn.query('SELECT * FROM activity WHERE remind=? AND checked=0',[originaldate],async function(err,response){
    

        var str=JSON.stringify(response)
        var getter=JSON.parse(str)

        const objeto=getter.map(a=>a.phone)
        const arraytojoin=[];
        for(i in objeto){arraytojoin.push(objeto[i])}

       // let arrayphone=arraytojoin.join(",")

        for (i in getter){
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            
            var perone=getter[i]
            var getphone=JSON.stringify(perone)
            var convertparse=JSON.parse(getphone)

           const phones= convertparse["phone"]
           const activitys=convertparse["activity"]
            console.log("Tel",phones)
            console.log("ACT",activitys)

            var dataString = JSON.stringify({ 
                "from": { "type": "whatsapp", "number": process.env.FROM_NUM }, 
                "to": { "type": "whatsapp", "number": phones }, 
                "message": { 
                    "content": { 
                        "type": "text", 
                        "text": "AcDaily te recuerda " + activitys 
                    } 
                } 
            });

            var options = {
                url: 'https://messages-sandbox.nexmo.com/v0.1/messages',
                method: 'POST',
                headers: headers,
                body: dataString,
                auth: {
                    'user': process.env.USER,
                    'pass': process.env.PASSWORD
    
              
                }
            };
        
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
    
            request(options, callback);

        }

     


    })

} 



/////////////////////////END whatsapp function/////////////////////////////////////////////////////////////

///////////////////////send email//////////////////////////////////////////////////////////////////////////
function givemessage([date]){
    console.log("se paso la lista a la funcion",[date])
    let datesearch= new Date(date)
    datesearch.setDate(datesearch.getDate())

    const getoriginaldate=datesearch.toISOString().slice(0,10)


    console.log("donde hay",getoriginaldate)
    dbconn.query('SELECT * FROM activity WHERE remind= ? AND  checked=0',[getoriginaldate],async function(err,message){
       
        var data=JSON.stringify(message);
        var get=JSON.parse(data);
        const objeto =get.map(a=>a.email)
        const arraytojoin=[]
        for(i in objeto){ arraytojoin.push(objeto[i])}
     
    var arraytosend=arraytojoin.join(",")
       
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MESSAGEEMAIL,
      pass: process.env.PASSEMAIL
    }
  });
 
  //////////////////this send the message
    var mailOptions = {
        from: process.env.MESSAGEEMAIL,
        to: arraytosend,
        subject: 'Tienes Actividades por relizar AcDaily',
        text: 'Termina tus citas en AcDaily'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
  }); 
        

    })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 


module.exports=router
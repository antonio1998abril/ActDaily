const Daily=require('../models/activityModel')
var dbconn = require('./../config/config');

module.exports={
    createnewtask:async(req,res)=>{
        try{
            const created_at=new Date();
            const updated_at =new Date();
            const checked=false;
           const {name,email,phone,daily,user,formatdate,date}=req.body;

            dbconn.query('SELECT * FROM activity WHERE user=? AND (name=? OR activity=?)',[user,name,daily],async(err,get)=>{
                const data=JSON.stringify(get)
                const json=JSON.parse(data)
                if(Object.keys(json).length === 0){
                     dbconn.query('INSERT INTO activity (name,email,phone,activity,created_at,updated_at,user,remind,dateact,checked) VALUES(?,?,?,?,?,?,?,?,?,?)',[name,email,phone,daily,created_at,updated_at,user,formatdate,date,checked],async function(err,result){
         
                        return res.json({error:false,result:result})
                    }) 
                 
                }else{
                        res.status(302).json()
                }
            });
            ////////////////////////////////////////7
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    deletetask:async(req,res)=>{
        try{
            const idelete=req.body.idact
            dbconn.query('DELETE  FROM activity WHERE id= ?',[req.body.idact],async function(err,result){
                return res.status(200).json({iddelete:idelete})
            });
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    updatetask:async(req,res)=>{
        try{
           
            const {email,phone,name,daily,idact,formatdate,date,checked,user}=req.body;
            if(checked==='true'){
                var setchecked=true
            }else{
                var setchecked=false
            }
            dbconn.query('SELECT * FROM activity WHERE user=? AND (name= ? OR activity =?)',[user,name,daily],async function (err,result){ 
                const data=JSON.stringify(result);
                const json =JSON.parse(data); 
                 
                if(!json[1]){
                    dbconn.query('UPDATE activity SET name=?,phone=?,email=?,activity=?,dateact=?,remind=?,checked=? WHERE id=?',[name,phone,email,daily,date,formatdate,setchecked,idact],async function(err,result){
                    
                    res.json({error:false,email:email,phone:phone,daily:daily,name:name,id:idact,date:date,user:user})
                    }) 
                }else{
                    res.status(302).json()
                } 
            })
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    
}
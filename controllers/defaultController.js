var dbconn = require('./../config/config');
const bcrypt=require('bcrypt');

module.exports={
    index:async(req,res)=>{
        try{
           var finduser=req.session.email;
            if(finduser){
                dbconn.query('SELECT * FROM users WHERE email= ?',[req.session.email],async function(err,result){
               
                    var data=JSON.stringify(result);
                    var get=JSON.parse(data);
                    const user=get[0] 
        
                    res.render('default/index',{user:user})
                })
            }else{
                res.render('default/index')
            }
           
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    login:async(req,res)=>{
        try{
            const session=req.session.email;
            if(session){
                res.redirect('/user')
            }else{
                res.render('default/login')
            }  
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    postlogin:async(req,res)=>{
        try{
            
           var logged={
               user: function(){
                const {email}=req.body;
                req.session.loggedin=true;
                req.session.email=email;
               }
           }   
        logged.user();
        res.status(200).json({url:'/user'});
        
        }catch(err){
            return res.status(302).json({msg:err.message})
        }
    },
    register:async(req,res)=>{
        try{
            const session=req.session.email;
            if(session){
                res.redirect('/user')
            }else{
                res.render('default/register')
            }
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    postregister:async(req,res,next)=>{
        try{
          
        const {phone,email,password,name}=req.body;
        dbconn.query('SELECT * FROM users WHERE email= ? OR phone= ?',[email,phone],async function (err,result){  
            const passwordHash= await bcrypt.hash(password,10);
            var data=JSON.stringify(result);
            const json=JSON.parse(data)
            console.log(json)
            console.log(Object.keys(json).length)
            if(Object.keys(json).length === 0){
                dbconn.query('INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)',[name,email,phone,passwordHash],async function(result){   
                    return res.status(200).json(result)
                       
                    });  

            }
            else{
                res.status(302).json() 
            };         
        }); 
        
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    getUser:async(req,res)=>{
        try{
            
          if(req.session.loggedin){
            dbconn.query('SELECT * FROM users WHERE email= ?',[req.session.email],async function(err,result){
                var data=JSON.stringify(result);
                var get=JSON.parse(data);
                const user=get[0]

              const transuser=user.id
              const final=JSON.stringify(transuser);
                dbconn.query('SELECT * FROM activity WHERE user= ?',[user.id],async function(err,getall){
          
                 
                    
                        res.render('user/index',{user:user,getall})
                        
                    })  
                })
            }else{
                res.redirect('/login')
            }  
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    logout:async(req,res)=>{
        req.session.destroy(function(err) {
            //cal back method
            return res.status(200).json({})
         })
    },
    seeconfig:async(req,res)=>{
        try{
            dbconn.query('SELECT * FROM users WHERE id= ?',[req.params.id],async function(err,result){
                var data=JSON.stringify(result);
                var get=JSON.parse(data);
                const user=get[0];

                dbconn.query('SELECT COUNT(*) FROM activity WHERE user=? AND checked=0',[req.params.id],async function(err,todoresult){

                    dbconn.query('SELECT COUNT(*) FROM activity WHERE user=? AND checked=1',[req.params.id],async function(err,doneresult){
                        const todo=todoresult[0]['COUNT(*)'];
                        
                        const done=doneresult[0]['COUNT(*)']
                
                        res.render('user/config',{user:user,todo:todo,done:done})
                        })
                    })
            })
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    updateconfing:async(req,res)=>{
   try{
    const {phone,email,password,name,userid}=req.body;
    dbconn.query('SELECT * FROM users WHERE email= ? OR phone= ?',[email,phone],async function (err,result){  
        var data=JSON.stringify(result);
            const json=JSON.parse(data)
   
        if(password.length===0){
           
            
            if(!json[1]){
                console.log("actualizao excepto la contraseña")
                dbconn.query('UPDATE users SET name=?,email=?,phone=? WHERE id=?',[name,email,phone,userid],async function(result){
                        return res.status(200).json({})
                }); 

             
            }
            else{
                console.log("Repetido sin cambio")
                res.status(302).json()   
            };  
        }else{
            const passwordHash= await bcrypt.hash(password,10);
       
            if(!json[1]){
              

                console.log("Actualizado")
                dbconn.query('UPDATE users SET name=?,email=?,phone=?,password=? WHERE id=?',[name,email,phone,passwordHash,userid],async function(result){
                        return res.status(200).json({})
             
                }); 
            }
            else{
                console.log("Repetido")
                res.status(302).json() 
            };  
        }
              
    });
   }catch(err){
        return res.status(500).json({msg:err.message})    
        }
    } 

};
    /*     check each element of aaray 
    for(i in data){
    var leter=data.charAt(i);
    console.log("numero: "+i+leter)} */
    /* get info like json given by query of mysql var data=JSON.stringify(result);
    var json=JSON.parse(data);
    var founduser=json[0].name;  */ 
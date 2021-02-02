var dbconn = require('./../config/config');
const bcrypt=require('bcrypt');

const auth=(req,res,next)=>{
    try{
        const {email,userpassword}=req.body;
      
        dbconn.query ('SELECT * FROM users WHERE email= ?',[email],async function(err,result){
            var data=JSON.stringify(result);
            if(data.length==2){
                return res.status(302).json(data)
            }else{
                dbconn.query ('SELECT * FROM users WHERE email= ?',[email],async function(err,result){
                    const Match= await bcrypt.compare(userpassword,result[0].password)  
                    console.log(Match)
                    if(!Match){
                        return res.status(302).json(Match)
                    }else{
                        next();
                    }
                                                 
                });  
            }                    
        });

        
    }catch(err){
        return res.status(500).json({msg:err.message})
    }
}

module.exports=auth
/* var dbconn = require('./../config/config');
 
var Daily = function(task){
    this.name =task.name;
    this.email =task.email;
    this.phone =task.phone;
    this.activity =task.daily;
    this.created_at     = new Date();
    this.updated_at     = new Date();
    this.user=task.user;
    this.remind=task.formatdate;
    this.dateact=task.date
    this.checked=false
};

Daily.create=(newEmp,result,res)=>{
var data=JSON.stringify(newEmp);
var json=JSON.parse(data)
const name=json["name"]
const activity=json["activity"]

dbconn.query('SELECT * FROM activity WHERE name=? OR activity=?',[name,activity],async(err,get,res)=>{
    const data=JSON.stringify(get)
    const json=JSON.parse(data)
console.log("se encontro",json[0])
    if(json[0]){
        console.log("error: ",err);
        return res.status(500).json({msg:err.message})
    }else{
    dbconn.query("INSERT INTO activity set ?", newEmp,function(err,res){
                if(err){
                    console.log("error: ",err);
                    result(err,null)
                }else{
                    console.log(res.insertId);
                    result(null,res.insertId)
                }
            })
        }
    })
   
}

module.exports=Daily */
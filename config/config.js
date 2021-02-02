'use strict';

const mysql=require('mysql');
    const dbconn=mysql.createConnection({
  /*   hostname:'localhost',
    user:'id15717018_active',
    password:'$~vn\vh]\?o\#1Vd',
    database:'id15717018_activity' */
 /*    hostname:'localhost',
    user:'root',
    password:'',
    database:'daily' */
    host:'bf0swkpg1d5agkxzhjah-mysql.services.clever-cloud.com',
    user:'umj33rtnwm1arl0b',
    password:'GGhBP2csTv72hxcxAUOc',
    database:'bf0swkpg1d5agkxzhjah'
        });
        dbconn.connect(function(err){
            if(err) throw err;
        console.log("Database Connected")
        });

module.exports=dbconn
    

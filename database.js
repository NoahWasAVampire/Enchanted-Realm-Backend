const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
let instance = null;

const connection = mysql.createConnection({
    connectionLimit : 100, //important
    host     : '34.159.78.37',
    user     : 'root',
    password : 'realm135*',
    database : 'enchantedrealm',
    debug : false,
})

connection.connect((err)=>{
    if (err){
        console.log(err.message);
    }
    console.log('db success');
})

class Database{
    static getdatabaseInstance(){
    return instance ? instance : new Database();
    }
    async getAllData(){
        try {
          /*  const response = await new Promise((resolve, reject)=> {
                const query = "SELECT * FROM user WHERE u_id = ?"
                connection.query(query, [1],(err, result)=>{
                    if (err) reject(new Error(err.message))
                    resolve(result);
                })
            });*/
            const response = await new Promise((resolve, reject)=> {
                const query = "SELECT * FROM user"
                connection.query(query,(err, result)=>{
                    if (err) reject(new Error(err.message))
                    resolve(result);
                })
            });
            console.log(response);
            return response;
        }catch (error){
            console.log(error)
        }
    }
    async insertNewUser(name, password, confirmedPassword){
        try {
            const test = await new Promise((resolve, reject)=> {
                const query = 'INSERT INTO user (name , password) VALUES (?, ?);';
                connection.query(query,[name,password],(err, results)=>{
                    if (err) reject(new Error(err.message))
                    resolve(results);
                })
            });
            console.log(test);
            return test;
        }catch (error) {
            console.log(error);
        }
    }
    async getUser(name, password){
        try {
            /*  const response = await new Promise((resolve, reject)=> {
                  const query = "SELECT * FROM user WHERE u_id = ?"
                  connection.query(query, [1],(err, result)=>{
                      if (err) reject(new Error(err.message))
                      resolve(result);
                  })
              });*/
            const response = await new Promise((resolve, reject)=> {
                const query = "SELECT * FROM user WHERE name = ? AND password = ?"
                connection.query(query,[name,password],(err, result)=>{
                    if (err) reject(new Error(err.message))
                    resolve(result);
                })
            });
            console.log(response);
            return response;
        }catch (error){
            console.log(error)
        }
    }



}
module.exports = Database;



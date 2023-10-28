//var db=require('../../config/connection')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const ceoSchema = new Schema({
    name : String,
    email : String,
    password : String

  });

const ceo= mongoose.model('ceo', ceoSchema);

function register(ceoData){

    return new Promise(async(resolve,reject)=>{
        ceoData.password=await bcrypt.hash(ceoData.password,10)
        const newceo = new ceo();
        newceo.name=ceoData.name;
        newceo.email=ceoData.email;
        newceo.password=ceoData.password;

        newceo.save();

        resolve(newceo);
    })

}

function login(ceodata){
    return new Promise(async(resolve,reject)=>{
        let response={};
        const eml=ceodata.email;
        const psd=ceodata.password;


        const filter={email:eml}
        try {
            const val = await ceo.findOne(filter).maxTimeMS(15000).exec();
            // Rest of your code
        } catch (error) {
            console.error('Mongoose error:', error);
            // Handle the error, including the timeout error
            resolve({ status: false });
        }
        

        
        if(val){

            bcrypt.compare(psd, val.password, function(err, result) {
                if(result){
                   
                    response.val=val;
                    response.status=true;
                    resolve(response)
                }else{
                    console.log("wrong password");
                    resolve({status:false})
                }
            });
        }
        else{
           //console.log("seen");
           resolve({status:false})
        }
    }
    )

   

 
}

module.exports={
    register,
    login
}
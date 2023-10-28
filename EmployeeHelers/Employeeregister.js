const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');



const employeeSchema = new Schema({
    name: String,
    age: Number,
    email: String,
    dateField: {
        type: Date,
        default: Date.now, // Optional: Set a default value to the current date and time
    },
    departmentname: String,
    departmentid: {
        type: Schema.Types.ObjectId,
        ref: 'dept', // Reference to the "Department" model
    },
    password: String,
});

const emp = mongoose.model('emp', employeeSchema);

function registeremployee(empData) {
    return new Promise(async (resolve, reject) => {
        try {

            const existingEmployee = await emp.findOne({ email:empData.email });

            if(existingEmployee){
                reject();


            }else{

            
            // Hash the password
            empData.password = await bcrypt.hash(empData.password, 10);

            // Create a new employee document
            const newemp = new emp({
                name: empData.name,
                age: empData.age,
                email: empData.email,
                departmentname: empData.departmentname,
                departmentid: empData.departmentid,
                password: empData.password,
                
            });

            // Save the document
            await newemp.save();

            resolve(newemp);
        }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    registeremployee,
    emp
};

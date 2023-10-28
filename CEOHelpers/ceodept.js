const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var empdet = require('../EmployeeHelers/Employeeregister');
//const bcrypt = require('bcrypt')
const moment = require('moment');
const departmentSchema = new Schema({

    name : String,
    departmentid : String,
    employees: [
      {
       employeeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "emp",
        },
      },
    ],

    manager: {
      type: Schema.Types.ObjectId,
      ref: 'emp', // Reference to the "Department" model
  },

  manager_name:String

    
  });

const dept= mongoose.model('dept',departmentSchema);

function registerdept(deptData){

    return new Promise(async(resolve,reject)=>{
       
        const newdept = new dept();
        newdept.name=deptData.departmentname;
        newdept.departmentid=deptData.departmentid;
      

        newdept.save();

        resolve(newdept);
    })

}

async function fnd() {
    const all = await dept.find({}).lean();
    console.log(all);
    return all;
  }

  function displaydept(id){
    return new Promise(async(resolve,reject)=>{
      const query = dept.where({ _id: id });
  const x= await query.findOne();
     // const x=Image.find({_id: id});
      //console.log(x);
      resolve(x);
    })
  }


  function addemptodept(empinfo){

    return new Promise(async(resolve,reject)=>{
      let  did= await dept.findOne({ _id: empinfo.departmentid });
      if (did) {
        console.log(did)
        
      }
      const options = { new: true };
      const x=await dept.findByIdAndUpdate(did, { $push: {employees: {
        employeeId:empinfo._id
    }}}, options)

      console.log(x);
    })
        
   
  }

  function getdeptDetails(crntdept){
    return new Promise(async(resolve,reject)=>{
      const department=await dept.findOne({ _id:  crntdept});

      resolve(department);

    })
  }

  function getusrDetails(crntdept){
    return new Promise(async(resolve,reject)=>{

      const department=await dept.findOne({ _id:  crntdept});

      

      //console.log(departmentmanager)
      const employees=department.employees.map(employee => employee.employeeId)

      const fullemployeedetails=await empdet.emp.find({_id: {$in: employees}}).lean();

      fullemployeedetails.forEach(employee => {
        // Add the formatted date
        employee.formattedDate = moment(employee.dateField).format("DD-MM-YY");
    
        // Calculate the experience based on the dateField (assuming it's a date)
        const currentDate = new Date(); // Current date
        const dateField = new Date(employee.dateField); // Convert dateField to a Date object
        const experience = currentDate.getFullYear() - dateField.getFullYear();
        

        const isExperienceGreaterThan5 = experience > 5;
    
        // Add the experience
        employee.experience = experience;
        
        employee.isExperienceGreaterThan5 = isExperienceGreaterThan5;
    });

      resolve(fullemployeedetails);


      //console.log(employees);


  //    const cartproducts = await Cart.findOne({ userId: usrid });
  //  // console.log(cartproducts.items)
  //   const cartProductIds = cartproducts.items.map(item => item.productId);
   
  //   const realproducts = await adhelpers.Image.find({ _id: { $in: cartProductIds } }).lean();
   
  //   resolve(realproducts)
    
     
   
   })
   }

   function update_manager(id,deptid,manager_name){
    return new Promise(async(resolve,reject)=>{
     
      var manager_update={
        manager:id,
        manager_name:manager_name
      }
    
      const updateddept = await dept.findByIdAndUpdate(deptid, manager_update, { new: true });

      resolve(updateddept)
    
    }
    )}
  

module.exports={
    registerdept,
    fnd,
    displaydept,dept,addemptodept,getusrDetails,update_manager,getdeptDetails
}


//rrvDrbwgocPECh55
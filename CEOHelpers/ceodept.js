const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var empdet = require('../EmployeeHelers/Employeeregister');
//const bcrypt = require('bcrypt')
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
    ]

    
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

  function getusrDetails(crntdept){
    return new Promise(async(resolve,reject)=>{

      const department=await dept.findOne({ _id:  crntdept});

      const employees=department.employees.map(employee => employee.employeeId)

      const fullemployeedetails=await empdet.emp.find({_id: {$in: employees}}).lean();

      resolve(fullemployeedetails);


      //console.log(employees);


  //    const cartproducts = await Cart.findOne({ userId: usrid });
  //  // console.log(cartproducts.items)
  //   const cartProductIds = cartproducts.items.map(item => item.productId);
   
  //   const realproducts = await adhelpers.Image.find({ _id: { $in: cartProductIds } }).lean();
   
  //   resolve(realproducts)
    
     
   
   })
   }
  

module.exports={
    registerdept,
    fnd,
    displaydept,dept,addemptodept,getusrDetails
}
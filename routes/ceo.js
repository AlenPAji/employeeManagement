var express = require("express");
var router = express.Router();

var ceohelper = require("../CEOHelpers/ceologin");
var depthelper = require("../CEOHelpers/ceodept");
var empacthelper=require("../EmployeeHelers/Employeeregister");



/* GET users listing. */
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/ceo/login");
  }
};

const user = {
  type: "CEO",
  rte: "ceo",
};
router.get("/", verifyLogin, function (req, res, next) {
  
  async function c(){
    const ceoname = req.session.user.name;

  
    //console.log(user)
  
    const deptdetails=await depthelper.fnd();
    
      //console.log(products)
      res.render("ceo-dashboard", { ceoname ,deptdetails});

      
    }
  
   c();


});

router.get("/add-dept", verifyLogin, function (req, res, next) {
  res.render("add-dept");
});

router.get("/login", function (req, res, next) {
  res.render("login", { user });
});

router.get("/register", function (req, res, next) {
  res.render("login", { user });
});


router.get("/ceo-dashboard", verifyLogin,function (req, res, next) {
  res.render("login", { user });
  

});

router.get("/recruit-employee", verifyLogin,function (req, res, next) {
  console.log(req.query.id)
depthelper.displaydept(req.query.id).then((response)=>{
  console.log(response);
  res.render("new-recruit",{response});
  
})



});

router.get("/view-employee", verifyLogin,function (req, res, next) {
console.log(req.query.id)


  
  depthelper.getusrDetails(req.query.id).then((response)=>{



    
      //response.dateField=moment(response.dateField).format("DD-MM-YY");

      
console.log(response)
      

    res.render("viewemp",{response});

  })

});

router.get("/showdepartmentdepartment", verifyLogin,function (req, res, next) {
  console.log(req.query.id)
  
  
    
    depthelper.getdeptDetails(req.query.id).then((response)=>{
  
  
  
      
        //response.dateField=moment(response.dateField).format("DD-MM-YY");
  
        
  console.log(response)

  res.render("department",{response})
        
  
     
  
    })
  
  });

router.get("/appoint-manager", verifyLogin,function (req, res, next) {
 
  depthelper.update_manager(req.query.id,req.query.departmentid,req.query.manager_name).then((response)=>{
 res.render("success");
  })
    
  
  });

router.post("/login", function (req, res, next) {
  console.log(req.body);
  // ceohelper.register(req.body).then((response)=>{
  //   console.log(response)
  // })

  ceohelper.login(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.val;
      res.redirect("/ceo");
    } else {
      req.session.loginErr = "Invalid login credentials please try again";
      res.redirect("/login");
    }
  });
});

router.post("/register", function (req, res, next) {
ceohelper.register(req.body).then((response)=>{
  res.redirect("/ceo/login");
})
});

router.post("/add-dept", verifyLogin, function (req, res, next) {
  depthelper.registerdept(req.body).then((responce) => {
    res.redirect("/ceo"); 
  }); 
});


router.post("/recruit-employee", verifyLogin, function (req, res, next) {
// Get the current timestamp in milliseconds

const timestamp = Date.now();

// Convert the timestamp to a string
const timestampStr = timestamp.toString();
const password = timestampStr.slice(-6);
console.log(password)
req.body.password=password;
// Use a portion of the timestam
empacthelper.registeremployee(req.body).then((responce)=>{
  console.log(responce);
 depthelper.addemptodept(responce);
  res.redirect("/ceo")
})

  
});





module.exports = router;

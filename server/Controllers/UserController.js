const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo       = require('../Data/UserRepo');
const _userRepo      = new UserRepo();

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;
    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            username:     req.body.username,
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            streetAddress:  req.body.streetAddress,
            email:        req.body.email,
            phone: req.body.phone,
            salary: req.body.salary,
        });
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        res.json({ obj:null, errorMessage: err})
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                        function () { 
                            res.json({ obj:newUser, errorMessage:err})
                    });
                });

    }
    else {
      res.json({ obj:null, errorMessage: "Passwords do not match."})
    }
};

exports.LoginUser = async function(req, res) {
    passport.authenticate('local') (req, res, 
        function (err) { 
            if (err) {
                res.json({ errorMessage:err }) 
            }
            else {
                res.json({user:{ errorMessage:""}}) 
            }
            
    });
}


// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.json({ user:{}, isLoggedIn:false, errorMessage : "",
                               reqInfo:reqInfo});
};

// Receives posted data that is used to update the item.
exports.UpdateSalary = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);

    // Parcel up data in a 'User' object.
    let tempUserObj  = new User( {
        username: request.body.username,
        salary:    request.body.salary,
    });

    // Call update() function in repository with the object.
    let responseObject = await _userRepo.updateEmpSalary(tempUserObj);

    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        response.json({ user:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        console.log(JSON.stringify(responseObject.errorMessage))
        response.json({ 
            user:      responseObject.obj, 
            errorMessage: responseObject.errorMessage, reqInfo:reqInfo });
    }
}

// Receives posted data that is used to update the item.
exports.Update = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);

    // Parcel up data in a 'User' object.
    let tempUserObj  = new User( {
        username: request.body.username,
        email:    request.body.email,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        streetAddress: request.body.streetAddress,
        phone: request.body.phone
    });

    // Call update() function in repository with the object.
    let responseObject = await _userRepo.update(tempUserObj);

    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        response.json({ user:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        console.log(JSON.stringify(responseObject.errorMessage))
        response.json({ 
            user:      responseObject.obj, 
            errorMessage: responseObject.errorMessage, reqInfo:reqInfo });
    }
}

// This function returns data to authenticated users only.
exports.SecureUserJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req);

    if(reqInfo.authenticated) {
        // Call update() function in repository with the object.
        let responseObject = await _userRepo.getUser(reqInfo.username);

        res.json({errorMessage:"", reqInfo:reqInfo, user:responseObject,
            secureData: "Congratulations! You are authenticated and you have "
                +  "successfully accessed this message."})
    }
    else {
        res.json({errorMessage:'/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'})
    }
}

// This function returns data to authenticated users only.
exports.SecureAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req);

    if(reqInfo.authenticated) {
        res.json({errorMessage:"", reqInfo:reqInfo,
            secureData: "Congratulations! You are authenticated and you have "
                +  "successfully accessed this message."})
    }
    else {
        res.json({errorMessage:'/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'})
    }
}

// This function returns data to logged in managers only.
exports.ManagerAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['HR', 'Manager']);

    if(reqInfo.rolePermitted) {
        res.json({errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}

// This function returns data to logged in managers only.
exports.EmployeesJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['HR', 'Manager']);
    let users = await _userRepo.allUsers();
    console.log(users)
    if(reqInfo.rolePermitted) {
        if(users!= null) {
            // response.render('Order/Index', { orders:orders })
            res.json({errorMessage:"", employees:users});
        }
        else {
            // response.render('Order/Index', { orders:[] })
            res.json({errorMessage:"No employees", employees:[]});
        }
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}

// This function returns data to logged in managers only.
exports.PayrollJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['HR']);
    let users = await _userRepo.getPayrollUsers();

    if(reqInfo.rolePermitted) {
        if(users!= null) {
            // response.render('Order/Index', { orders:orders })
            res.json({errorMessage:"", employees:users});
        }
        else {
            // response.render('Order/Index', { orders:[] })
            res.json({errorMessage:"No employees", employees:[]});
        }
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}

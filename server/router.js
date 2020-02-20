var HomeController   = require('./Controllers/HomeController');
var UserController   = require('./Controllers/UserController');
const authMiddleware = require('./authHelper')
const cors           = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes
    
    app.post('/User/RegisterUser', cors(), UserController.RegisterUser);
    app.post('/User/LoginUser', cors(), UserController.LoginUser);
    app.get('/User/Logout', cors(), UserController.Logout);
    
    app.post('/User/Update', cors(), UserController.Update);
    
    app.post('/User/UpdateSalary', cors(), UserController.UpdateSalary);
    
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )

    // Accessible to authenticated user. CORS must be enabled
    // for client App to access it.
    app.get('/User/SecureAreaJwt', cors(),
        authMiddleware.requireJWT, UserController.SecureAreaJwt)
    
    app.get('/User/SecureUserJwt', cors(),
        authMiddleware.requireJWT, UserController.SecureUserJwt)

    app.get('/User/ManagerAreaJwt', cors(),
        authMiddleware.requireJWT, UserController.ManagerAreaJwt)

    app.get('/User/EmployeesJwt', cors(),
        authMiddleware.requireJWT, UserController.EmployeesJwt)

    app.get('/User/PayrollJwt', cors(),
        authMiddleware.requireJWT, UserController.PayrollJwt)

};

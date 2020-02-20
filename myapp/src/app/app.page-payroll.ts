import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';

const BASE_URL = "http://localhost:1337/";

@Component({
    templateUrl: './pagePayroll.html'
})

export class PagePayrollComponent {
    _http:HttpClient;
    errorMessage:String = "";
    username: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    phone: string;
    email: string;
    salaryArray: Array<any> = [];

    employeesArray: Array<any>;
    employees: Array<any>;

    reqInfo:{} = null;
    token                 = '';
    message               = 'Not logged in.';
    secureData:string     = '';
    managerData:string    = '';
    msgFromServer:string  = '';
    _apiService:ApiService;
    public site='http://localhost:1337/';


    // Since we are using a provider above we can receive 
    // an instance through a constructor.
    constructor(private http: HttpClient) {
        this._http = http;
        this._apiService = new ApiService(http, this);

        this.getToken();
    }

    getToken() {
        // Logged in if token exists in browser cache.
        if(sessionStorage.getItem('auth_token')!=null) {
            this.token   = sessionStorage.getItem('auth_token');
            this.message = "The user has been logged in."
            this._apiService.getData('User/SecureAreaJwt', 
                this.userDataCallback);
            this._apiService.getData('User/PayrollJwt', 
                this.payrollDataCallback);
        }
        else {
            this.message = "Not logged in.";
            this.token   = ''
        }
    }

    UpdateSalary(username, Salary) {
        // This free online service receives post submissions.

        this.http.post(BASE_URL + "User/UpdateSalary",
            {
                username:   username,
                salary:   Salary,
            })
        .subscribe(
            // Data is received from the post request.
            (data) => {
                // Inspect the data to know how to parse it.
                console.log("POST call successful. Inspect response.", 
                            JSON.stringify(data));
                this.errorMessage = data["errorMessage"];
                if (this.errorMessage == "" || this.errorMessage == null) {
                    window.location.reload()
                }
                else{
                    this.errorMessage=JSON.stringify(data["errorMessage"]);
                }
            },
            // An error occurred. Data is not received. 
            error => {
                this.errorMessage = error;  
                console.log(error)           
            });
    }

    // Callback needs a pointer '_this' to current instance.
    userDataCallback(result, _this) {
        if(result.errorMessage == "") {
            _this.reqInfo = result.reqInfo;
        }
        else {
            alert(JSON.stringify(result.errorMessage)); 
        }
    }

    // Callback needs a pointer '_this' to current instance.
    payrollDataCallback(result, _this) {
        if(result.errorMessage == "") {
            _this.employeesArray = []
            _this.employeesArray = result.employees;
        }
        else {
            alert(JSON.stringify(result.errorMessage)); 
        }
    }

}
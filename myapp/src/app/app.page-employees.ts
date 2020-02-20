import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';

const BASE_URL = "http://localhost:1337/";

@Component({
    templateUrl: './pageEmployees.html'
})

export class PageEmployeesComponent {
    _http:HttpClient;
    errorMessage:String = "";
    username: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    phone: string;
    email: string;

    employeesArray: Array<any>;

    roles: Array<any>;
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
            this._apiService.getData('User/EmployeesJwt', 
                this.employeeDataCallback);
        }
        else {
            this.message = "Not logged in.";
            this.token   = ''
        }
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
    employeeDataCallback(result, _this) {
        if(result.errorMessage == "") {
            _this.employeesArray = result.employees;
        }
        else {
            alert(JSON.stringify(result.errorMessage)); 
        }
    }

}
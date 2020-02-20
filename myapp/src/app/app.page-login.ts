import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';

const BASE_URL = "http://localhost:1337/";

@Component({
    templateUrl: './pageLogin.html'
})

export class PageLoginComponent {
    _http:HttpClient;
    errorMessage:String = "";
    username: string;
    password: string;

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
    constructor(private http: HttpClient, private router: Router) {
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
            //alert(JSON.stringify(result.errorMessage)); 
        }
    }

    Login(myForm) {
        let url = this.site + "auth";
    
        // This free online service receives post submissions.
        this.http.post(url, {
                username:  this.username,
                password:  this.password,
            })
        .subscribe( 
        // Data is received from the post request.
        (data) => {
            // Inspect the data to know how to parse it.
            console.log(JSON.stringify(data));
            
            if(data["token"]  != null)  {
                this.token = data["token"]     
                sessionStorage.setItem('auth_token', data["token"]);
                this.message = "The user has been logged in." 
                //this.getToken();
                window.location.reload();
            }
        },
        // An error occurred. Data is not received. 
        error => {
            //alert(JSON.stringify(error));             
        });
    }
}
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';

const BASE_URL = "http://localhost:1337/";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})

export class AppComponent {
    _http: HttpClient;
    errorMessage: String = "";
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
            this._apiService.getData('User/ManagerAreaJwt', 
                this.rolesDataCallback);
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

    Logout() {
        let url = BASE_URL + 'User/Logout'
        this._http.get<any>(url)
            // Get data and wait for result.
            .subscribe(result => {
                sessionStorage.clear();
                // Clear data.
                this.secureData    = ""; 
                this.managerData   = "";
                this.reqInfo       = {};
                this.msgFromServer = "";
                //this.router.navigate(['page-login']);
                window.location.reload();
                },
                error => {
                    // Let user know about the error.
                    this.errorMessage = error;
        })
    }

    rolesDataCallback(result, _this) {
        if(result.errorMessage == "") {
            if (result.reqInfo.roles.includes('HR')){
                _this.hr = true
            }
            if (result.reqInfo.roles.includes('Manager')){
                _this.manager = true
            }
        }
        else {
            //alert(JSON.stringify(result.errorMessage)); 
        }
    }
}

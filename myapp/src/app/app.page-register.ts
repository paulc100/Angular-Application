import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';

const BASE_URL = "http://localhost:1337/";

@Component({
    templateUrl: './pageRegister.html'
})

export class PageRegisterComponent {
    _http: HttpClient;
    _router:Router;
    errorMessage: String = "";
    username: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    email: string;
    phone: string;
    salary: Number = 10000;
    password: string;
    passwordConfirm: string;

    // Since we are using a provider above we can receive 
    // an instance through a constructor.
    constructor(private http: HttpClient, private router: Router) {
        this._http = http;
        this._router = router;
    }

    Register(valid) {
        // This free online service receives post submissions.

        if (valid == true){
        this.http.post(BASE_URL + "User/RegisterUser",
            {
                username:   this.username,
                firstName:   this.firstName,
                lastName:   this.lastName,
                streetAddress:  this.streetAddress,
                email:  this.email,
                phone:   this.phone,
                salary:   this.salary,
                password:   this.password,
                passwordConfirm:   this.passwordConfirm,
            })
        .subscribe(
            // Data is received from the post request.
            (data) => {
                // Inspect the data to know how to parse it.
                console.log("POST call successful. Inspect response.", 
                            JSON.stringify(data));
                            this.errorMessage = data["errorMessage"];
                            if (this.errorMessage == "" || this.errorMessage == null) {
                    this._router.navigate(['page-login']);
                }
                else{
                    this.errorMessage=JSON.stringify(data["errorMessage"]);
                }
            },
            // An error occurred. Data is not received. 
            error => {
                this.errorMessage = error;                
            });
    }
    }
}

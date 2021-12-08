import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor{
    constructor(private auth: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
            Authorization: `Bearer ${this.auth.getAccessToken()}`
            //Authorization: this.auth.getAccessToken()
            }
        });
        console.log("interceptor has been called")
        return next.handle(req).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse){
                        console.log('Server has responded');
                    }
                },
                (err) => {
                //     if (err instanceof HttpErrorResponse) {
                // //     if (this.jwtHelper.isTokenExpired(this.auth.getToken())){
                // //        this.auth.logout();
                // //        this.router.navigate(['']);
                //     }
                    if (err.status == 401)
                        alert('Неправильный пароль или электронная почта');
                    else 
                        console.log('Server responded without error');
                }
            )
          )
    }
}

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class AuthInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // get token from localstorage
        const serializedUser = localStorage.getItem('user');
        if (serializedUser) {
            const user = JSON.parse(serializedUser);
            const token = user?.token;
            if (token) {
                const clonedReuqest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next.handle(clonedReuqest);
            }
        }
        return next.handle(req);
    }
}

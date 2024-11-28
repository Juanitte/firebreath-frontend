import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LocalstorageService } from '../common/localstorage.service';
import { environment, LocalStorageKeys } from '../../utilities/literals';
import { Authenticate } from '../../utilities/enum-http-routes';
import { Routes } from '../../utilities/routes';
import { iUser } from '../../models/iUser';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    constructor(private http: HttpClient, private router: Router, private usersService: UsersService,
                private localstorageService: LocalstorageService) {

        const storedToken = this.localstorageService.getItem(LocalStorageKeys.tokenKey);
        if (storedToken) {
            this.authTokenSubject.next(storedToken);
        }
    }

    /**
     * Comprueba si el usuario esta logeado.
     * @returns 
     */
    isLogged(): boolean {
        if(this.localstorageService.getItem(LocalStorageKeys.tokenKey)) {
            if(this.localstorageService.getItem(LocalStorageKeys.loggedUser)) {
                if(!this.usersService.currentUser?.id){
                    this.usersService.getUserById(parseInt(this.localstorageService.getItem(LocalStorageKeys.loggedUser)!)).subscribe({
                        next: (user) => {
                            this.usersService.currentUser = user;
                        },
                        error: (error) => {
                            console.log('error', error);
                        }
                    });
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Realiza el inicio de sesión de un usuario. Guarda en localStorage el token de autenticación.
     * @param email el email del usuario.
     * @param password la contraseña del usuario.
     * @returns 
     */
    login(email: string, password: string): Observable<any> {
        const loginData = { email, password };
        return this.http.post<any>(environment.apiUrl + Authenticate.login, loginData).pipe(
            tap(response => {
                if (response && response.token) {
                    this.localstorageService.setItem(LocalStorageKeys.tokenKey, response.token);
                    this.authTokenSubject.next(response.token);

                    const loggedUser: iUser = {
                        id: response.userId, userName: response.userName,
                        email: response.email, phoneNumber: response.phoneNumber,
                        role: response.role, language: response.languageId,
                        fullName: response.fullName
                     }

                    this.usersService.currentUser = loggedUser;
                    console.log('loggedUser', this.usersService.currentUser);

                    if(response.userId) {
                        this.localstorageService.setItem(LocalStorageKeys.loggedUser, response.userId);
                    }
                    
                    if(response.languageId) {
                        this.localstorageService.setItem(LocalStorageKeys.userLanguageKey, response.languageId);
                        switch(this.localstorageService.getItem(LocalStorageKeys.userLanguageKey)) {
                            case '1':
                                this.localstorageService.setItem(LocalStorageKeys.selectedLanguage, 'en');
                                break;
                            case '2':
                                this.localstorageService.setItem(LocalStorageKeys.selectedLanguage, 'es');
                                break;
                            default:
                                this.localstorageService.setItem(LocalStorageKeys.selectedLanguage, 'es');
                                break;
                        }
                    }
                }
            })
        );
    }

    /**
     * Elimina el token de autenticación y los datos del usuario de localStorage
     * para manejar el cierre de sesión.
     */
    logout(): void {
        this.localstorageService.removeItem(LocalStorageKeys.tokenKey);
        this.localstorageService.removeItem(LocalStorageKeys.userLanguageKey);
        this.localstorageService.removeItem(LocalStorageKeys.loggedUser);
        if(this.localstorageService.getItem(LocalStorageKeys.selectedTicket)) {
            this.localstorageService.removeItem(LocalStorageKeys.selectedTicket);
        }
        this.localstorageService.removeItem(LocalStorageKeys.reloaded);
        //this.usersService.currentUser = null;
        this.authTokenSubject.next(null);
        this.router.navigate([Routes.login]);
    }


    getAuthToken(): Observable<string | null> {
        return this.authTokenSubject.asObservable();
    }
}

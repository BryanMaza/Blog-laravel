import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { from } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  public token;
  public identity;
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = "Identificate";
    this.user = new User(1, '', '', '', 'ROLE_USER', '', '', '');
  }

  ngOnInit() {
    //se ejecuta siempre y cierra cuando le llega el paramtro sure por el url
    this.logOut();
  }
  onSubmit(form) {
    this._userService.signUp(this.user).subscribe(
      response => {
        if (response.status != "error") {
          this.status = 'success';

          this.token = response;

          //Objeto ususario identificado
          this._userService.signUp(this.user, true).subscribe(
            response => {
              this.identity = response;



              //Guardar los datos del usuario para mantenerte logeado
              console.log(this.token);
              console.log(this.identity);


              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));

              //redireccionamos al inicio
              this._router.navigate(['inicio']);
            },
            error => {
              this.status = 'Error';
              console.log(<any>error);
            }
          );

        } else {
          this.status = "error";
        }

      },
      error => {
        this.status = 'Error';
        console.log(<any>error);
      }
    );
  }
  logOut() {
    //recibe parametros de la url
    this._route.params.subscribe(
      params => {
        let logout = +params['sure'];

        if (logout == 1) {
          //eliminamos los valores del local storage
          localStorage.removeItem('identity');
          localStorage.removeItem('token');

          //eliminamos de memoria los datos
          this.token = null;
          this.identity = null;

          //redireccionamos al inicio
          this._router.navigate(['inicio']);

        }
      }
    );
  }

}

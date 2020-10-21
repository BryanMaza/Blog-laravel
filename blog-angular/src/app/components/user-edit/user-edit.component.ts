import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global'
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status;
  public identity;
  public token;
  public url;
  //configuracion para la subida de imagen
  public afuConfig = {

    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI: {
      url: global.url + 'user/upload',
      method: "POST",
      headers: {
        "Autorization": this._userService.getToken(),
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Suber tu avatar de usuario",


  };
  constructor(private _userService: UserService) {
    this.page_title = "Ajustes del usuario";
    this.user = new User(1, '', '', '', 'ROLE_USER', '', '', '');
    this.url=global.url;

    //usamos el usuario identificado para mostrar datos
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    //pasa los valores de identity al obejeto usuario
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.email,
      this.identity.role,
      this.identity.description,
      '', '');
  }

  ngOnInit(): void {
  }
  onSubmit(form) {


    this._userService.update(this.token, this.user).subscribe(
      response => {
        if (response) {
          console.log(response);

          this.status = "success";
          //actualizar usuario en secion
          if (response.changes.name && response.status) {
            this.user.name = response.changes.name;

          }
          if (response.changes.surname) {
            this.user.surname = response.changes.surname;
          }
          if (response.changes.email) {
            this.user.email = response.changes.email;
          }
          if (response.changes.description) {
            this.user.description = response.changes.description;
          }
          if (response.changes.image) {
            this.user.image = response.changes.image;
          }


          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));

        } else {
          this.status = "error";
        }

      },
      error => {
        this.status = "error";
        console.log(<any>error);

      }
    );
  }

  //subir la imagen
  avatarUpload(datos) {
    let data = JSON.parse(datos.response);
    this.user.image=data.image;
   
    
  }

}

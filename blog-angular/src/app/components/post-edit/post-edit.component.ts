import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post'
import {global} from '../../services/global';
import{PostService} from '../../services/post.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers: [UserService, CategoryService,PostService]
})
export class PostEditComponent implements OnInit {
  public page_title: string;
  public status;
  public identity;
  public token;
  public post: Post;
  public categories;
  public is_edit:boolean;
  public url;

  public afuConfig = {

    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI: {
      url: global.url + 'post/upload',
      method: "POST",
      headers: {
        "Autorization": this._userService.getToken(),
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Subir imagen",


  };
  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _postService:PostService,
  ) {
    this.page_title = "Editar Entrada";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.is_edit=true;
    this.url=global.url;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getPost();
  
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null);
    

  }
  onSubmit(form) {
    this._postService.update(this.token,this.post,this.post.id).subscribe(
      response=>{
        if(response.status=="success"){
          this.status="success";
          //redirigir a la pagina de post
          this._router.navigate(['/entrada',this.post.id]);
        }else{
          this.status="error"
        }
        console.log(response);
        this.status="error"
        
      },
      error=>{
        console.log(<any>error);
        
      }
    );
    
  }
  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status=="success"){
          this.categories=response.categories;
          console.log(this.categories);
          
        }
      },
      error => {
        console.log(error);
        
      }
    );
  }

  getPost() {
    //sacar el id del post
    this._route.params.subscribe(
      params => {

        let id = +params.id;

        //peticion ajax para sacr los datos
        this._postService.getPost(id).subscribe(
          response => {
            if (response.status == 'success') {

              this.post = response.posts;
              //para que no pueda acceder mediante la rutas a un post que no sea suyo
              if(this.post.user_id !=this.identity.sub){
                this._router.navigate(['/inicio']);
              }

            } else {
              this._router.navigate(['/inicio']);
            }

          },
          error => {
            
            console.log(<any>error);
            this._router.navigate(['/inicio']);

          }
        );

      }
    );

  }

  imageUpload(data) {
    let image_data = JSON.parse(data.response);
    this.post.image=image_data.image;   
  }
  
  
 
  
}

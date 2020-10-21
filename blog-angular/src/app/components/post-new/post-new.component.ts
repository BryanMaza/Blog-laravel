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
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService,PostService]
})
export class PostNewComponent implements OnInit {
  public page_title: string;
  public status;
  public identify;
  public token;
  public post: Post;
  public categories;
  public is_edit:boolean;

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
    this.page_title = "Crear entrada";
    this.identify = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.is_edit=false;
  }

  ngOnInit(): void {
    this.getCategories();
  
    this.post = new Post(1, this.identify.sub, 1, '', '', null, null);
    

  }
  onSubmit(form) {
    this._postService.create(this.token,this.post).subscribe(
      response=>{
        
        
        if(response.status=="success"){
          this.post=response.post;
          this.status="success";
          this._router.navigate(['/inicio']);
        }else{
          this.status="error";
          
        }
      },
      error=>{
        this.status="error";
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
  imageUpload(data) {
    let image_data = JSON.parse(data.response);
    this.post.image=image_data.image;   
  }
  
 
  
}

import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import {global} from '../../services/global';
import{UserService} from '../../services/user.service';
import { User } from 'src/app/models/user';
import {Post} from '../../models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    PostService,
    UserService
  ]
})
export class HomeComponent implements OnInit {
  public page_title: string;
  public posts:Array<Post>;
  public status;
  public url;
  public identity;
  public token;
  constructor(
    private _postService: PostService,
    private _userService:UserService,
    private _route:ActivatedRoute,
    private _router:Router
  ) {
    this.page_title = 'Inicio';
    this.url=global.url;
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPosts();
    
    
    
    
  }
  getPosts() {
    this._postService.getPosts().subscribe(
      response => {
        if (response.status == "success") {
          this.status = "success";
          this.posts = response.posts;
          console.log(this.posts);
          
        } else {
          this.status = "success"
        }


      },
      error => {
        this.status = "error"
        console.log(<any>error);
      }
    );
  }

  getPost(id){
    this._postService.getPost(JSON.stringify(id)).subscribe(
      response=>{
        console.log(response);
        
      },
      error=>{
        console.log(<any>error);
        
      }
    );
  }
  deletePost(id){
    this._postService.delete(this.token,id).subscribe(
      response=>{
        if(response.status=="success"){
          this.getPosts();
        
          
        }else{
          this.status="error";
        }
        
      },
      error=>{
        console.log(<any>error);
        
      }
    );
  }
}

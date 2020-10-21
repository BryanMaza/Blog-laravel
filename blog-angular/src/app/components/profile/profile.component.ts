import { PostService } from '../../services/post.service';
import {global} from '../../services/global';
import{UserService} from '../../services/user.service';
import {Post} from '../../models/post';
import {User} from '../../models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers :[PostService,UserService]
})
export class ProfileComponent implements OnInit {


  public status;
  public url;
  public posts:Array<Post>
  public identity;
  public token;
  public user:User;

  constructor(
    private _postService: PostService,
    private _userService:UserService,
    private _route:ActivatedRoute,
    private _router:Router
  ) {
    this.url=global.url;
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
  }

  ngOnInit(): void {

  this.getProfile();
    
  }

  getProfile(){
    this._route.params.subscribe(
      params=>{
        let userId=+params['id'];
        this.getPosts(userId);
        this.getUser(userId);
      }
    );
  }

  getPosts(userId) {
    this._userService.getPosts(userId).subscribe(
      response => {
        if (response.status == "success") {
          this.status = "success";
         this.posts=response.posts;
          
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
  getUser(userId){
    this._userService.getUser(userId).subscribe(
      response=>{
        if(response.status=="success"){
         this.user=response.user;
         console.log(this.user);
         
          
        }else{
          this.status="error";
        }
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
         this.getProfile();
        
          
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

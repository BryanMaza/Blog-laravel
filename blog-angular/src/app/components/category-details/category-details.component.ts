import { Component, OnInit } from '@angular/core';
import  {Router, ActivatedRoute,Params} from '@angular/router';
import{ UserService} from '../../services/user.service';
import{Category} from '../../models/category';
import{ CategoryService} from '../../services/category.service';
import{global} from '../../services/global';
import {PostService} from '../../services/post.service'
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css'],
  providers:[UserService, CategoryService,PostService]
})
export class CategoryDetailsComponent implements OnInit {

  public page_title:string;
  public identity;
  public token;
  public category:Category;
  public status;
  public posts:any;
  public url:string;
  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _categoryService:CategoryService,
    private _postService:PostService
  ) { 
    this.page_title="Crear Categoria";
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
    this.category= new Category(1,'');
    this.url=global.url;
  }

  ngOnInit(): void {
    this.getPostByCategory();
  }

  getPostByCategory(){
    this._route.params.subscribe(
      params=>{
        let id=params['id'];
        this._categoryService.getCategory(id).subscribe(
          response=>{
            if(response.status=="success"){
              this.category=response.categories;
              
              this._categoryService.getPosts(id).subscribe(
                response=>{
                 if(response.status=="success"){
                  this.posts=response.posts;
                  console.log(this.posts);
                  
                 }
                  
                },
                error=>{
                  console.log(<any>error);
                  
                }
              );
              
            }else{
              this._router.navigate(['/inicio']);
            }
          },
          error=>{
            console.log(<any>error);
          }
        );
      }
    );
  }
  deletePost(id){
    this._postService.delete(this.token,id).subscribe(
      response=>{
        if(response.status=="success"){
          this.getPostByCategory();
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
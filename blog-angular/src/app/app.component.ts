import { Component, OnInit,DoCheck } from '@angular/core';
import {UserService} from './services/user.service';
import{global} from './services/global';
import{ CategoryService} from './services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[
    UserService,
    CategoryService
  ]
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'Blog de angular';
  public identity;
  public token;
  public url;
  public categories;
  constructor(
    public _userService:UserService,
    public _categoryService:CategoryService,
    
  ){
    this.url=global.url;
    this.loadUser();
    
  }
  //metodo que se ejecuta al iniciar la web
  ngOnInit(){
    console.log("Webbapp carganda corectamente");
    this.getCategories();

  }

  //metodo que se ejecuata cada vez que registra algun cambio
  ngDoCheck(){
    this.loadUser();
  }

  loadUser(){
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
  }
  getCategories(){
    this._categoryService.getCategories().subscribe(
      response=>{
        if(response.status=="success"){
          this.categories=response.categories;
          
          
        }
      },
      error=>{
        console.log(error);
        
      }
    );
  }
  
}

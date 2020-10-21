import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import {global} from './global';
import { stringify } from '@angular/compiler/src/util';
@Injectable()
export class CategoryService {
    public url:string;
  
    constructor(
        private _http: HttpClient
    ) {
        this.url=global.url;
    }
    create(token,category):Observable<any>{
        let json=JSON.stringify(category);
        let params="json="+json;
        let headers= new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Autorization',token);

        return this._http.post(this.url+'category',params,{headers:headers});
    }
    getCategories():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.get(this.url+'category',{headers:headers});
    }
    //sacar una categoria en concreto
    getCategory(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.get(this.url+'category/'+id,{headers:headers});
    }

    //sacar post de una categoria
    getPosts(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.get(this.url+'post/category/'+id,{headers:headers});
    }
}
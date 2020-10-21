import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import {global} from './global';
import { stringify } from '@angular/compiler/src/util';
@Injectable()
export class UserService {
    public url:string;
    public identity;
    public token;
    constructor(
        public _http: HttpClient
    ) {
        this.url=global.url;
    }
    test() {

        return "Hola mundo desde un servicio";
    }
    //registramos a un usuario
    register(user):Observable<any>{
        let json=JSON.stringify(user);
        //para que la api reciba datos de este archivo
        let params='json='+json;
        //que tipo de peticion se va a hacer
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        //peticion ajax con la url
        //primer parametro es la url,el segundo los parametros,tercero las cabeceras
        return this._http.post(this.url+'register',params,{headers:headers});
    }
    signUp(user,gettoken=null):Observable<any>{
        if(gettoken!=null){
            user.gettoken='true';
        }
        let json=JSON.stringify(user);
        let params='json='+json;
        let headers= new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.post(this.url+'login',params,{headers:headers});
    }
    //actualiza los datos del usuario le pasamos el token y el usuario a modificar
    update(token,user):Observable<any>{
        //combertimos un obejto de js a json
        let json=JSON.stringify(user);
        let params="json="+json;
        let headers= new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Autorization',token);

        //enviamos por put para modificar datos
        return this._http.put(this.url+'user/update',params,{headers:headers});
    }
    //devolvera el usuario identificado
    getIdentity(){
        let identity=JSON.parse(localStorage.getItem('identity'));
        if(identity && identity!='undefined'){
            this.identity=identity;
        }else{
            this.identity=null;
        }
        return this.identity;
    }
    //devolvera el token del usuario identificado
    getToken(){
        let token=localStorage.getItem('token');
        if(token && token!='undefined'){
            this.token=token;
        }else{
            this.token=null;
        }
        return this.token;
    }
    //devulve los posts de ese usuario
    getPosts(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.get(this.url+'post/user/'+id,{headers:headers});
    }
    getUser(id):Observable<any>{
        let  headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.get(this.url+'user/detail/'+id,{headers:headers});
    }
    
}
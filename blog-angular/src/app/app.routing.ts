
//Imports necesarios 
import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router'

//Importar los componentes
import{LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import {CategoryNewComponent} from './components/category-new/category-new.component';
import{PostNewComponent}from './components/post-new/post-new.component';
import{PostDetailComponent} from './components/post-detail/post-detail.component';
import{PostEditComponent} from './components/post-edit/post-edit.component';
import{CategoryDetailsComponent} from './components/category-details/category-details.component';
import {IdentityGuard} from './services/identity.guard';
import {ProfileComponent} from './components/profile/profile.component';

//DEFINIR LAS RUTAS
const appRoutes:Routes=[
    {path:'',component:HomeComponent },
    {path:'inicio',component:HomeComponent },
    {path:'login',component:LoginComponent },
    {path:'logout/:sure',component:LoginComponent },
    {path:'registro',component:RegisterComponent },
    {path:'ajustes',component:UserEditComponent,canActivate:[IdentityGuard]},{
        path:'crear-entrada',component:PostNewComponent,canActivate:[IdentityGuard]
    },
    {path:'crear-categoria',component:CategoryNewComponent,canActivate:[IdentityGuard]},
    {path:'entrada/:id',component:PostDetailComponent,canActivate:[IdentityGuard]},
    {path:'editar-entrada/:id',component:PostEditComponent,canActivate:[IdentityGuard]},
    {path:'categoria/:id',component:CategoryDetailsComponent},
    {path:'perfil/:id',component:ProfileComponent,canActivate:[IdentityGuard]},
    {path:'**',component:ErrorComponent },
];

//EXPORT LAS RUTAS
export const appRoutingProviders:any[]=[];//servira para cargar el router como servicio
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);//hara que toda esta configuracion funcione
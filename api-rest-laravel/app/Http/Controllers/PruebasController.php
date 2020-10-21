<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//importar modelo de esta manera ya se puede sacar informacionde la bas de datos
use App\Category;
use App\Post;

class PruebasController extends Controller
{
    public function index(){
        $titulo="Animales";
        $animales = ['Perro','Gato','Tigre'];

        return view('pruebas.index',array(
            'titulo'=>$titulo,
            'animales'=> $animales
            
        ));
    }

    public function testOrm(){
        //devuele un array de obejtos con todos los datos de la tabla posts
        $posts= Post::all();
/*
        foreach($posts as $post){
            echo "<h1>".$post->title."</h1>";
            echo "<span>{$post->user->name}-{$post->category->name}</span>";
            echo "<p>".$post->content."</p>";
            echo "<hr>";
        }*/

        $categories = Category::all();

        foreach($categories as $category){
            echo "<h1>{$category->name}</h1>";

            foreach($category->posts as $post){
                echo "<h3>".$post->title."</h3>";
                echo "<span>{$post->user->name}-{$post->category->name}</span>";
                echo "<p>".$post->content."</p>";
                echo "<hr>";
            }
        }
        
        die();
    }
    
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //Define la tabla
    protected $table='categories';

    public function posts(){
        //relacion uno a muchos y devuelve todos los post de esa categoria
        return $this->hasMany('App\Post');
    }
}

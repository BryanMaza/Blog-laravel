<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //definir la tabla
    protected $table='posts';

    protected $fillable = [
        'title','content' ,'category_id','image'
    ];
    //relacion de uno a muchos inversa(muchos a uno);
    public function user(){

        //devuelve todo lo relacionado con ese id
        return $this->belongsTo('App\User','user_id');
    }

    public function category(){

        return $this->belongsTo('App\Category','category_id');
    }
    
}

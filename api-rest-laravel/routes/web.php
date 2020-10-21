<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Cargando clases
use App\Http\Middleware\ApiAuthMiddleware;

//RUTAS DE PRUEBA
Route::get('/', function () {
    return view('welcome');
});
Route::get('/wellcome', function () {
    return view('welcome');
});

//crear una ruta pasando un parametro
Route::get('/prueba/{nombre?}',function($nombre = null){
    $texto='<h1>TExto de otra ruta</h1>';
    $texto.='Nombre: '.$nombre;

    return view('pruebas', array(
        'texto'=>$texto
    ));
});

//crear una ruta desde un controlador
Route::get('/animales','PruebasController@index');
Route::get('/test-orm','PruebasController@testOrm');

/*
*GET: conseguir datos o recursos
*POST: Guardar datos o recursos o hacer logica de un formulario
*PUT: Atualizar datos o recursos
*DELETE: Eliminar datos o recursos

*/

//RUTAS DE API
//Route::get('/usuario/pruebas','UserController@pruebas');
//Route::get('/categoria/pruebas','CategoryController@pruebas');
//Route::get('/entrada/pruebas','PostController@pruebas');

//para evitar que nos de error con el metodo post sin que sea un formulario nos dirigimos a al archivo kernel \Controllers\Middleware\Kernel.php y comentamos en la linea de Verify



//RUTAS DEL CONTROLADOR USER
Route::post('/api/register','UserController@register');
Route::post('/api/login','UserController@login');

//Para actualizar cosas en la base de datos utilizamos "PUT"
//actualizar usuario
Route::put('/api/user/update','UserController@update');
//subir imagen
Route::post('/api/user/upload','UserController@upload')->middleware(ApiAuthMiddleware::class);
//Devolver imagen
Route::get('/api/user/avatar/{filename}','UserController@getImage');
//Devolver datos del usuario
Route::get('/api/user/detail/{id}','UserController@detail');

//RUTAS DEL CONTROLADOR CATEGORIAS
Route::resource('/api/category', 'CategoryController');

//RUTAS DEL CONTROLADOR DE ENTRADAS(POST)
Route::resource('/api/post', 'PostController');
//Subir imagen al post
Route::post('/api/post/upload','PostController@upload')->middleware(ApiAuthMiddleware::class);

//devolver uan imagen
Route::get('/api/post/image/{filename}', 'PostController@getImage');
//devolver los post segun la categoria
Route::get('/api/post/category/{id}', 'PostController@getPostsByCategory');
//devolver los post segun el usuario
Route::get('/api/post/user/{id}', 'PostController@getPostsByUser');

//PARA LISTAR LAS RUTAS O INFORMACION DE NUESTRA API ESCRIBIMOS:  php artisan route:list

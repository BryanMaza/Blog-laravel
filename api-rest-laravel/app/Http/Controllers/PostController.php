<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use Illuminate\Http\Response;
use App\Helpers\JwtAuth;

class PostController extends Controller
{
    //llamamos al middleware
    public function __construct()
    {
        $this->middleware('api.auth', ['except' => [
            'index', 
            'show', 
            'getImage',
            'getPostsByCategory',
            'getPostsByUser']]);
    }
    public function index()
    {
        //Sacamos todos los post
        $posts = Post::all()->load('category'); //cargamos la categoria relacionada al post

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'posts' => $posts
        ], 200);
    }

    public function show($id)
    {
        $post = Post::find($id)->load('category')->load('user');
        if (is_object($post)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'posts' => $post
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'posts' => 'La entrada no existe'
            ];
        }
        return response()->json($data, $data['code']);
    }

    //Crear un nuevo post
    public function store(Request $request)
    {
        //Recoger los datos por post
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {

            //conseguir usuario identificado
            $user = $this->getIdentity($request);


            //Validar lso datos
            $validate = \Validator::make($params_array, [
                'title' => 'required',
                'content' => 'required',
                'category_id' => 'required',
                'image' => 'required'

            ]);



            if ($validate->fails()) {
                $data = [
                    'code' => 404,
                    'status' => 'error',
                    'posts' => 'No se ha guardado el post, faltan datos'
                ];
            } else {
                $post = new Post();


                $post->user_id = $user->sub;
                $post->category_id = $params->category_id;
                $post->title = $params->title;
                $post->content = $params->content;
                $post->image = $params->image;

                $post->save();

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'posts' => $post
                ];
            }
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'posts' => 'Envia los datos correctamente'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request)
    {



        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {

            $validate = \Validator::make($params_array, [
                'title' => 'required',
                'content' => 'required',
                'image' => 'required',
                //'category_id' => 'required',
            ]);

            //tambien puedes utilizar esto apra devolver errores de validacion
            //return response()->json($validate->errors(),400);



            unset($params_array['id']);
            unset($params_array['created_at']);
            unset($params_array['user_id']);
            unset($params_array['user']);
            //conseguir usuario identificado
            $user = $this->getIdentity($request);

            //Buscamos el registro

            //conseguir el registro
            $post = Post::where('id', $id)->where('user_id', $user->sub)->first();

            if (!empty($post) && is_object($post)) {
                $post->update($params_array);
                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'post' => $post,
                    'changes' => $params_array
                ];
            } else {
                $data = [
                    'code' => 404,
                    'status' => 'error',
                    'message' => 'No existen datos'
                ];
            }
        }
        return response()->json($data, $data['code']);
    }

    //Eliminar un post
    public function destroy($id, Request $request)
    {
        //Verificar que es el usuario que creo el post
        $user = $this->getIdentity($request);

        //conseguir el registro
        $post = Post::where('id', $id)->where('user_id', $user->sub)->first();
        //Comprobar si no esta vacio
        if (!empty($post)) {
            //Borrar registro
            $post->delete();
            //Devolver algo
            $data = [
                'code' => 200,
                'status' => 'success',
                'posts' => $post
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'El post no existe'
            ];
        }


        return response()->json($data, $data['code']);
    }


    private function getIdentity(Request $request)
    {
        $jwtAuth = new JwtAuth();
        $token = $request->header('Autorization', null);
        $user = $jwtAuth->checkToken($token, true); //true para que me devuelva el objeto decodificado

        return $user;
    }

    public function upload(Request $request)
    {
        //Recoger la imagen de la peticion
        $image = $request->file('file0');

        //Validar la imagen

        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        if (!$image || $validate->fails()) {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'Error al subir la imagen'
            ];
        } else {
            $image_name = time() . $image->getClientOriginalName(); //Para obtener el nombre original de la imagen

            //Guardar la imagen
            \Storage::disk('images')->put($image_name, \File::get($image));
            //Devolver datos

            $data = [
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            ];
        }
        return response()->json($data, $data['code']);
    }

    public function getImage($filename)
    {
        //comprobar si existe el fichero
        $isset = \Storage::disk('images')->exists($filename);
        if ($isset) {
            //Conseguir la imagen
            $title = \Storage::disk('images')->get($filename);
            //Devolver la imagen
            return new Response($title, 200);
            //Mostrar
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'La imagen no existe'
            ];
        }
        return response()->json($data, $data['code']);
    }
    //devulve los post con su categoria
    public function  getPostsByCategory($id)
    {
        $posts = Post::where('category_id', $id)->get();
        return response()->json([
            'status'=>'success',
            'posts'=>$posts
        ],200);
    }
    public function getPostsByUser($id){
        $posts = Post::where('user_id', $id)->get();
        return response()->json([
            'status'=>'success',
            'posts'=>$posts
        ],200);
    }


}

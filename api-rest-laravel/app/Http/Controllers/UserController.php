<?php

namespace App\Http\Controllers;

use App\helpers\JwtAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use App\User;

class UserController extends Controller
{
    public function pruebas(Request $request)
    {
        return "pruebas de user controller";
    }


    //IMPORTANTE - los datos siempre se tienen que devolver en Json
    public function register(Request $request)
    {

        //Primero recogemos los datos del usuario por post
        $json = $request->input('json', null);

        //decodifica el json en un objeto para tratarlo con php
        $params = json_decode($json);
        $params_array = json_decode($json, true); //lo convierte en array

        //comprobar si no hay datos
        if (!empty($params) && !empty($params_array)) {


            //limpiar datos
            $params_array = array_map('trim', $params_array);

            //Validar los datos
            $validate = Validator::make($params_array, [
                'name' => 'required|alpha',
                'surname' => 'required|alpha',
                'email' => 'required|email|unique:users', //Comprobar si el usuario existe ya (usuario duplicado)

                'password' => 'required',
            ]);

            //comprueba la validacion
            if ($validate->fails()) {

                $data = array(
                    'status' => 'error',
                    'code' => '404',
                    'message' => 'El usuario no se ha creado correctamente',
                    'errors' => $validate->errors()
                );
            } else {



                //Cifrar la contraseña

                $pwd = hash('SHA256', $params->password);


                //Crear el usuario y añadirle los valores
                $user = new User();
                $user->name = $params_array['name'];
                $user->surname = $params_array['surname'];
                $user->email = $params_array['email'];
                $user->password = $pwd;
                $user->role = 'ROLE_USER';


                //Guardar el usuario, haria un insert en la base de datos
                $user->save();

                $data = array(
                    'status' => 'success',
                    'code' => '200',
                    'message' => 'El usuario se ha creado correctamente',
                    'user' => $user
                );
            }
        } else {
            $data = array(
                'status' => 'error',
                'code' => '404',
                'message' => 'Datos del usuario no son correctos ',

            );
        }

        return response()->json($data, $data['code']);
    }
    public function login(Request $request)
    {
        $jwtAuth = new \JwtAuth();

        //recibir datos por POST
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        //Validar los datos recibidos

        $validate = Validator::make($params_array, [
            'email' => 'required|email', //Comprobar si el usuario existe ya (usuario duplicado)

            'password' => 'required',
        ]);

        //comprueba la validacion
        if ($validate->fails()) {

            $signup = array(
                'status' => 'error',
                'code' => '404',
                'message' => 'El usuario no se ha podido identificar',
                'errors' => $validate->errors()
            );
        } else {
            //Cifrar la password
            $pwd = hash('sha256', $params->password);
            //Devolver token o datos 
            $signup = $jwtAuth->signup($params->email, $pwd);

            if (!empty($params->gettoken)) {
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
        }

        return response()->json($signup, 200);
    }

    //Actualizar los datos del usuario
    public function update(request $request)
    {
        //recogemos la cabezera
        //comprobamos si el usuario esta identificado
        $token = $request->header('Autorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        //REcoger los datos por Post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);


        if ($checkToken && !empty($params_array)) {

            //Sacar usuario identificado
            $user = $jwtAuth->checkToken($token, true);

            //validar los datos
            $validate = Validator::make($params_array, [
                'name' => 'required|alpha',
                'surname' => 'required|alpha',
                'email' => 'required|email|unique:users,' . $user->sub //Comprobar si el usuario existe ya (usuario duplicado)

            ]);
            //quitar campos que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_toke']);
            //Actualizar el usuario

            $user_update = User::where('id', $user->sub)->update($params_array);

            //Devolver array con resultado
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $user,
                'changes' => $params_array
            );
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'El usuario no esta identificados'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function upload(Request $request)
    {

        //Recoger datos de la peticion
        $image = $request->file('file0');

        //Validacion de imagen
        $validate = \Validator::make($request->all(), ['file0' => 'required|image|mimes:jgp,jpeg,png,gif']);
        //Guardar la  imagen
        if (!$image || $validate->fails()) {

            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'Error al subir imagen'
            );
        } else {

            $image_name = time() . $image->getClientOriginalName(); //recoger el nombre verdadero de la imagen concatenado con el time 
            \Storage::disk('users')->put($image_name, \File::get($image)); //metodo put para guardar el archivo

            $data = array(

                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            );
        }
        //Devolver el resultado



        return response()->json($data, $data['code']);
    }

    public function getImage($filename)
    {
        //verificar si existe
        $isset = \Storage::disk('users')->exists($filename);

        if ($isset) {
            //llamamos al disco que esta utilizando y obtenemos el archivo
            $file = \Storage::disk('users')->get($filename);

            return new Response($file, 200);
        }else{
            $data = array(

                'code' => 400,
                'status' => 'error',
                'image' => 'La imagen no existe'
            );
        }
        return response()->json($data, $data['code']);
    
    }

    public function detail($id){
        //buscamos el usuario con el id especificado
        $user = User::find($id);

        //comprobamos si existe
        if(is_object($user)){
            $data = array(
                'code'=>200,
                'status'=>'success',
                'user'=>$user
            );
        }else{
            $data = array(
                'code'=>404,
                'status'=>'error',
                'user'=>'El usuario no existe'
            );
        }

        return response()->json($data,$data['code']);
    }
}

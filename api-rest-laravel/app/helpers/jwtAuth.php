<?php
//definimos donde esta la clase
namespace App\helpers;
//libreria de JWT
use Firebase\JWT\JWT;
//libreria de base de datos
use Iluminate\Support\Facades\DB;
use App\User;

class JwtAuth
{
    public $key;

    public function __construct()
    {
        $this->key = 'esto_es_una_clave_super_secreta-1111';
    }
    public function signUp($email, $password, $getToken = null)
    {

        //Buscar si existe el usuario existe
        $user = User::where([
            'email' => $email,
            'password' => $password
        ])->first();
        //comprobar si son correctas
        $signup = false;
        if (is_object($user)) {
            $signup = true;
        }
        //Generar el token con los adtos del usuario
        if ($signup) {
            $token = array(
                'sub' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'surname' => $user->surname,
                'description'=>$user->description,
                'image'=>$user->image,
                'iat' => time(),
                'exp' => time() + (7 * 24 * 60 * 60)
            );

            
            //guardar el token
            $jwt = JWT::encode($token, $this->key, 'HS256'); //primer parametro es el token a guardar, el segundo es la llave unica la sabremos solo los que la programamos. El tercero es la codificacion


            //Devolver los datos decodificados o el token en funcion de un parametro
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            if (is_null($getToken)) {
                $data = $jwt;
            } else {
                $data =  $decoded;
            }
        } else {
            $data = array(
                'status' => 'error',
                'mesage' => 'Login incorrecto'
            );
        }


        return $data;
    }

    //metodo para poder autenticar al usuario recibiendo un token
    public function checkToken($jwt, $getIdentity=false){
        $auth=false;

        //este codigo es muy suceptible a errores asi que lo trataremos con try y catch
        try{

            $jwt=str_replace('""','',$jwt);//quitamos las comillas para evitar posibles errores

            $decoded=JWT::decode($jwt,$this->key,['HS256']);
        }catch(\UnexpectedValueException $e){
            $auth=false;
        }catch(\DomainException $e){
            $auth=false;
        }
        if(!empty($decoded)&& is_object($decoded)&& isset($decoded->sub)){
            $auth=true;
        }else{
            $auth=false;
        }
        if($getIdentity){
            return $decoded;
        }

        return $auth;
        
    }
}

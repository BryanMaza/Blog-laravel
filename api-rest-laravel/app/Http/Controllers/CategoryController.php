<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;

class CategoryController extends Controller
{

    public function __construct()
    {
        //Llamamos al middleware
        $this->middleware('api.auth', ['except' => ['index', 'show']]); //usa el middleware para todo excepto para estos metodos
    }

    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'categories' => $categories
        ]);
    }

    public function show($id)
    {
        $category = Category::find($id);
        if (is_object($category)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'categories' => $category
            ];
        } else {
            $data = [
                'code' => 200,
                'status' => 'success',
                'categories' => 'La categoria no existe'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function store(Request $request)
    {

        //Recoger los datos por post
        $json = $request->input('json', null); //el null e spor si no llega nada devuelva null
        $params_array = json_decode($json, true);

        if ($params_array != null) {


            //Validar los datos
            $validate = \Validator::make($params_array, [
                'name' => 'required'
            ]);
            //Guardar la categoria
            if ($validate->fails()) {
                $data = [
                    'code' => 404,
                    'status' => 'error',
                    'categories' => 'No se ha guardado la categoria'
                ];
            } else {
                //llamamos a categoria
                $category = new Category;

                //ingresamos los datos
                $category->name = $params_array['name'];
                //guardamos los datos en la base de datos
                $category->save();

                //Devolver el resultado
                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'categories' => $category
                ];
            }
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'categories' => 'No has enviado ninguna categoria'
            ];
        }
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request)
    { //como parametros el id de la categoria y un obejto request para recibir datos de la petecion porque va por put

        //Recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {
            //Validar los datos
            $validate = \Validator::make($params_array, [
                'name' => 'required'
            ]);
            //quitar lo que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['created_at']);
            //Actualizar registro 
            $category =  Category::where('id', $id)->update($params_array);
            $data = [
                'code' => 200,
                'status' => 'success',
                'categories' => $params_array
            ];

            //Devolver los datos


        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'categories' => 'No has enviado ninguna categoria'
            ];
        }

        return response()->json($data, $data['code']);
    }
}

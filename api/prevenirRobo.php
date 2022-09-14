<?php
//Importamos clase del empleado
require_once('helpers/database.php');
require_once('helpers/validator.php');
require 'models/rec.php';
//Definimos los métodos de php a usar
define('METHOD', 'AES-256-CBC');
define('SECRET_KEY', '$CARLOS@2016');
define('SECRET_IV', '101712');
//Comprobamos que halla una accion a realizar
if (isset($_GET['emp']) && isset($_GET['day'])) {
    /*
        Instanciamos las clases a usar
    */
    $validator = new Validator();//Instanciamos la clase validator
    $rec = new Rec();//Instanciamos la clase de rec
    /*
        Se declaran las funciones a utilizar
    */
    //Función para encriptar 
    function encryption($string)
    {
        $output = FALSE;
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_encrypt($string, METHOD, $key, 0, $iv);
        $output = base64_encode($output);
        return $output;
    }
    //Función para desencriptar
    function decryption($string)
    {
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_decrypt(base64_decode($string), METHOD, $key, 0, $iv);
        return $output;
    }
    /*
        Validamos que los datos recibidos sean los correctos
    */
    if (!$validator->validateAlphanumeric(decryption($_GET['emp']),1,100)) {//Validando que el usuario sea valido
        header('location: ../views/index.html');
    } elseif(!$validator->validateDate(decryption($_GET['day']))){//Validando que la fecha sea valida
        header('location: ../views/index.html');
    } elseif(!$rec->checkUsuarioEmpleado(decryption($_GET['emp']))){//Validando que el usuario exista
        header('location: ../views/index.html');
    } elseif(date('Y-m-d') != decryption($_GET['day'])){//Validando que la fecha enviada sea la de hoy
        header('location: ../views/index.html');
    } elseif(!$rec->checkBoss(decryption($_GET['emp']))){//Validando que el usuario no sea el del jefe
        header('location: ../views/index.html');
    } elseif($rec->cambiarEstadoEmp(5,decryption($_GET['emp']))){//Cambiando el estado a inactivo
        header('location: ../views/index.html');
    }else{
        header('location: ../views/index.html');
    }  
}else{
    header('location: ../views/index.html');
}

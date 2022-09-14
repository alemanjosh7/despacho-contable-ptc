<?php

//Se incluyen los archivos necesarios para el correcto funcionamiento
require_once "GoogleAuthenticator.php";

class Autentificador extends PHPGangsta_GoogleAuthenticator
{


    //Función para generar un secreto
    public function generarSecreto($usuario)
    {
        $secreto = $this->createSecret();
        return $this->generarQR($secreto,$usuario);
    }

    //Función para generar un códigoQR
    public function generarQR($clave,$usuario)
    {
        $contenedor = array();
        array_push($contenedor, $clave);
        $codigoQR = $this->getQRCodeGoogleUrl('Smart Bookkeeping ('.$usuario.')', $clave);
        array_push($contenedor, $codigoQR);
        return $contenedor;
       
    }

    //Función para validar que el código ingresado sea el correcto, recibe como parametro la clave secreta y el codigo de la app
    public function verificarCodigo($secreto,$valor)
    {
        if ($this->verifyCode($secreto, $valor)) { //Llave del usuario
            return true;
        } else {
            return false;
        }
    }
}
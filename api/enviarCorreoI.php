<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'libraries/PHPMailer/src/Exception.php';
require 'libraries/PHPMailer/src/PHPMailer.php';
require 'libraries/PHPMailer/src/SMTP.php';
require_once('../models/empleados.php');
require_once('../models/rec.php');

// Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
//session_start();
class EnvioC
{
    public function enviarEmailI($id,$user)
    {
        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);
        //Se instancia la clase de empleados
        $empleado = new Empleados;
        $rec = new Rec;
        $result = array('message' => null, 'exception' => null, 'status' => null);

        //Declaramos algunas variables
        $empleadoData = $empleado->obtenerEmpleado($id);
        $nombreCE = $empleadoData['nombre_empleado'].' '.$empleadoData['apellido_empleado'];
        $usuario = $user;
        $correo = $rec->obtenerCorreoJ();
        $correoData = $correo['correo_empleadocontc'];
        $body = '<!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
        
        
        <head>
        <!--Import Google Icon Font-->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <!--Import materialize.css-->
        <!-- Compiled and minified CSS -->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--Let browser know website is optimized for mobile-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0" charset="utf-8" />
        <title>Aviso de un usuario bloquedado</title>
        <style>
            *{
                margin: 0;
                padding: 0;
            }
            body{
                background-color: #F1F5F9;
            }

            .fondo-0{
            padding: 20px;
            background-color: #dee8f1;
            text-align: center;
            /*margin: 100px;*//*borrar linea*/
            }
            .fondo {
                padding: 40px;
                background-color: #F1F5F9;
                text-align: center;
                box-shadow: 3px 3px 4px 2px rgb(138, 136, 136);
            }
            .encabezado{
                width: 100%;
                height: 100px;
                background-color: #F4A172;
                text-align: center;
                border-radius: 5px;
                font-family: '.'Poppins'.', sans-serif;
                padding-top: 10px;
            }
            
            .fila1 {
                margin-left: 30%;
                margin-top: 1%;
            }
            
            .card-panel {
                background-color: #F4A172;
                width: 500px;
                height: 100px;
                border-radius: 10px;
            }

            .container h1{
                font-family: '.'Poppins'.', sans-serif;
                font-size: 25px;
            }
            
            .container p{
                font-family: '.'Poppins'.', sans-serif;
                font-size: 14px;
            }

            .card-panel h1{
                margin-left: 40%;
                padding-top: 25px;
                font-family: '.'Poppins'.', sans-serif;
            }
            </style>
            </head>
        </head>
        <body class=" grey lighten-3" style="margin: 0; padding:0;">
        <div class="fondo-0">
            <div class="edge">
                <div class="fondo">
                    <div class="encabezado">
                        <nav class="orange darken-4 center">
                            <div class="nav-wrapper">
                                <h5 style="margin: 0; font-size: 50px;">Smart Book</h5>
                            </div>
                        </nav>
                    </div>
                    <div class="container">
                        <h1 class="center-align" style="text-align: center;  margin-top: 1%;">¡Se bloqueo un usuario!</h1>
                        <br>
                        <p  style="text-align: center;">Te informamos que el usuario :'.$usuario.', perteneciente al empleado: '.$nombreCE.'. ¡Ha sido bloqueado!</p>
                        <p style="text-align: center;"><b>Para desbloquearlo dirigirse a la aplicación; Apartado empleado->Modificar al empleado bloqueado</b></p>
                        <br>
                        <p style="text-align: center;">Cambie su estado a activo para desbloquearlo</p>
                    </div>
                </div>
            </div>
        </div>
        <!--JavaScript al final para optimizar-->
        <!-- Compiled and minified JavaScript -->
        </body>
        </html>';

        $mensaje = wordwrap($body, 70, "\r\n");

        try {
            //Server settings
            $mail->SMTPDebug = 0;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'despcontableesquivel@gmail.com';                     //SMTP username
            $mail->Password   = 'iodowbuuzcrmrrua';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $mail->setFrom('despcontableesquivel@gmail.com', 'Smart Bookkeeping');
            $mail->addAddress($correoData, $nombreCE);     //Add a recipient

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = 'Intento de usuario bloqueado';
            $mail->Body    = $mensaje;
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
            $mail->CharSet  = 'utf-8';
            $mail->send();
            $result['status'] = 1;
            $result['message'] = 'Mensaje enviado correctamente';
        } catch (Exception $e) {
        }
    }
}

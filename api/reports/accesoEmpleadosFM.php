<?php
header('Content-type: application/pdf');
require('../helpers/dashboardReport.php');
require('../models/empleados.php');
require('../models/empresas.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Empleados con acceso a empresas', 'p');
$empleado = new Empleados;
$empresa = new Empresas;
if(!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] != 4){
    header('location: ../../views/index.html');
}
// Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
if ($dataEmpleado = $empleado->accesoEmpleadosEEmp()) {
    // Se recorren los registros ($dataProductos) fila por fila ($rowArchivos).
    foreach ($dataEmpleado as $rowEmpleado) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        //ESPACIO ENTRE CELDA
        $pdf->cell(13, 10, ' ', 0, 0, 'C');
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', 'B', 11);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(47, 10, utf8_decode('Tipo de empleado'), 1, 0, 'C', 1);
        $pdf->cell(70, 10, utf8_decode('Nombre Completo Empleado'), 1, 0, 'C', 1);
        $pdf->cell(30, 10, utf8_decode('Estado'), 1, 0, 'C', 1);
        $pdf->cell(40, 10, utf8_decode('DUI'), 1, 1, 'C', 1);
        // Se establece un color de relleno para mostrar el nombre de la categoría.
        $pdf->setFillColor(245, 254, 255, 1);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Times', '', 11);

        //ESPACIO ENTRE CELDA
        $pdf->cell(13, 10, ' ', 0, 0, 'C');
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(47, 10, utf8_decode($rowEmpleado['tipo_empleado']), 1, 0, 'C', 1);
        $pdf->cell(70, 10, utf8_decode($rowEmpleado['nombre_empleado'] . ' ' . $rowEmpleado['apellido_empleado']), 1, 0, 'C', 1);
        $pdf->cell(30, 10, utf8_decode($rowEmpleado['nombre_estado']), 1, 0, 'C', 1);
        $pdf->cell(40, 10, utf8_decode($rowEmpleado['dui_empleado']), 1, 1, 'C', 1);
        $pdf->Ln(5);

        if ($dataEmpresas = $empresa->obtenerEmpresasAsignCheck($rowEmpleado['id_empleado'])) {
            $pdf->setFillColor(249, 182, 145, 1);
            //ESPACIO ENTRE CELDA
            $pdf->cell(25, 10, ' ', 0, 0, 'C');
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11);
            // Se imprimen las celdas con los datos de los productos.
            $pdf->cell(50, 10, utf8_decode('Nombre de la empresa'), 1, 0, 'C', 1);
            $pdf->cell(70, 10, utf8_decode('Nombre del cliente'), 1, 0, 'C', 1);
            $pdf->cell(40, 10, utf8_decode('DUIT o NIT'), 1, 1, 'C', 1);

            foreach($dataEmpresas as $rowEmpresa){
                //ESPACIO ENTRE CELDA
                $pdf->setFillColor(255, 255, 255);
                //ESPACIO ENTRE CELDA
                $pdf->cell(25, 10, ' ', 0, 0, 'C');
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Times', '', 11);
                $pdf->SetWidths(array(50, 70, 40)); //Seteamos el ancho de las celdas
                $pdf->setHeight(10);
                $pdf->Row(array(utf8_decode($rowEmpresa['nombre_empresa']), $rowEmpresa['nombre_cliente'].$rowEmpresa['apellido_cliente'], $rowEmpresa['nit_empresa']));
                $pdf->Ln(5);
            }
        } else {
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(249, 182, 145, 1);
            //ESPACIO ENTRE CELDA
            $pdf->cell(13, 10, ' ', 0, 0, 'C');
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11);
            $pdf->cell(0, 10, utf8_decode('Hubo un error al traer las empresas a las que el empleado ' .
                utf8_decode($rowEmpleado['nombre_empleado'] . ' ' . $rowEmpleado['apellido_empleado']) . ' posee acceso'), 1, 1);
        }
    }
} else {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(255, 139, 144, 1);
    //ESPACIO ENTRE CELDA
    $pdf->cell(13, 10, ' ', 0, 0, 'C');
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Times', 'B', 11);
    $pdf->cell(0, 10, utf8_decode('No hay registros disponibles'), 1, 1);
}
// Se envía el documento al navegador y se llama al método footer()
$doc =  $pdf->output('s', 'accesoEmpleados.pdf');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../libraries/PHPMailer/src/Exception.php';
require_once '../libraries/PHPMailer/src/PHPMailer.php';
require_once '../libraries/PHPMailer/src/SMTP.php';
require_once('../models/rec.php');
//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);
$rec = new Rec;
$result = array('message' => null, 'exception' => null, 'status' => null);

//Declaramos algunas variables
$correo = $rec->obtenerCorreoEmp($_SESSION['id_usuario']);
$pdf = $doc;
$reportn = 'Empleados con accesos.pdf';
$cliente =  $_SESSION['nombreUsuario'].''. $_SESSION['apellidoUsuario'];
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
    background-color: white;/*cambiar a predeterminado(blanco)*/
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
    font-family: ' . 'Poppins' . ', sans-serif;
    padding-top: 10px;
}
.card-panel {
    background-color: #FA7479;
    width: 300px;
    height: 60px;
    border-radius: 10px;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}
.card-panel h1{
    text-align: center;
    padding-top: 20px;
    font-family: ' . 'Poppins' . ', sans-serif;
}
.container h1{
    padding-top: 10px;
    font-family: ' . 'Poppins' . ', sans-serif;
}
.container p{
    margin-top: 20px;
    font-family: ' . 'Poppins' . ', sans-serif;
}
.fila1 {
    margin-left: 0%;
    margin-top: 1%;
}
@media screen and (min-width: 200px) and (max-width: 433px)  {
    .encabezado{
    width: 100%;
    height: 40%;
    background-color: #F4A172;
    text-align: center;
    border-radius: 5px;
    font-family: ' . 'Poppins' . ', sans-serif;
    padding-top: 10px;
}
.card-panel {
    background-color: #FA7479;
    width: 180px;
    height: 60px;
    border-radius: 10px;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
}
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
                <h1 class="center-align" style="text-align: center;  margin-top: 1%;">Reporte generado</h1>
                <br>
                <p  style="text-align: center;">Te informamos que tu reporte solicitado, ha sido generado</p>
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
    $mail->Username   = 'smartbreport@gmail.com';                     //SMTP username
    $mail->Password   = 'rtfvncexlmfkqztj';                                    //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('despcontableesquivel@gmail.com', 'Smart Bookkeeping');
    $mail->addAddress($correo, $cliente);     //Add a recipient
    // definiendo el adjunto 
    $mail->AddStringAttachment($pdf, $reportn . '.pdf', 'base64', 'application/pdf');
    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Intento de usuario bloqueado';
    $mail->Body    = $mensaje;
    $mail->AltBody = 'Has solicitado un reporte';
    $mail->CharSet  = 'utf-8';
    $mail->send();
    $result['status'] = 1;
    $result['message'] = 'Reporte enviado al correo';
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} catch (Exception $e) {
    $result['exception'] = $mail->ErrorInfo;
    print(json_encode($result));
}


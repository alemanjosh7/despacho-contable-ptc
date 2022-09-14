<?php
// Se verifica si existe el parámetro id en la url, de lo contrario se direcciona a la página web de origen.
if (1 == 1) {
    require('../helpers/dashboardReport.php');
    require('../models/archivosSubidosEmp.php');
    // Se instancia el módelo productos para procesar los datos.
    $archivos = new ArchivosSubidosEmp;
    // Se instancia la clase para crear el reporte.
    $pdf = new Report;
    $pdf->startReport('Reporte resumen de archivos que he subido', 'l');
    //Validando que halla una session
    if(!isset($_SESSION['id_usuario'])){
        header('location: ../../views/index.html');
    }
    //Comprobamos que sea un empleado 
    if ($_SESSION['tipo_usuario'] != 4) {
        //Obtenemos los datos
        //Colocamos los encabezados
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', 'B', 11);
        //Se llenan las celdas con la información obtenida
        $pdf->cell(55, 10, utf8_decode('Nombre del archivo'), 1, 0, 'C', 1); //Nombre del archivo
        $pdf->cell(40, 10, utf8_decode('Fecha de subida'), 1, 0, 'C', 1); //Fecha de subida
        $pdf->cell(25, 10, utf8_decode('Tamaño'), 1, 0, 'C', 1); //Tamaño
        $pdf->cell(25, 10, utf8_decode('Estado'), 1, 0, 'C', 1); //Tamaño
        $pdf->cell(52, 10, utf8_decode('Empresa perteneciente'), 1, 0, 'C', 1); //Tamaño
        $pdf->cell(50, 10, utf8_decode('Descripción'), 1, 0, 'C', 1); //Tamaño
        $pdf->cell(30, 10, utf8_decode('Tipo'), 1, 1, 'C', 1); //Tamaño
        //Obtenemos la información de los archivos
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(245, 254, 255, 1);
        $pdf->Ln(5);
        $cont = 0; //Variable para contar
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', '', 11); //Fuente de las letras
        if ($rowArchivos = $archivos->reporteArchivosInf()) {
            //Llenamos con la info obtenida
            foreach ($rowArchivos as $rowArchivos) {
                //Evaluamos si se debe poner el encabezado
                $cont++;
                //Evaluamos si el contador esta en 4 que es él número de columnas para cambio  de página
                if ($cont > 12) {
                    $pdf->setFillColor(255, 139, 144, 1);
                    // Se establece la fuente para los encabezados.
                    $pdf->setFont('Times', 'B', 11);
                    //Se llenan las celdas con la información obtenida
                    $pdf->cell(55, 10, utf8_decode('Nombre del archivo'), 1, 0, 'C', 1); //Nombre del archivo
                    $pdf->cell(40, 10, utf8_decode('Fecha de subida'), 1, 0, 'C', 1); //Fecha de subida
                    $pdf->cell(25, 10, utf8_decode('Tamaño'), 1, 0, 'C', 1); //Tamaño
                    $pdf->cell(25, 10, utf8_decode('Estado'), 1, 0, 'C', 1); //Tamaño
                    $pdf->cell(52, 10, utf8_decode('Empresa perteneciente'), 1, 0, 'C', 1); //Tamaño
                    $pdf->cell(50, 10, utf8_decode('Descripción'), 1, 0, 'C', 1); //Tamaño
                    $pdf->cell(30, 10, utf8_decode('Tipo'), 1, 1, 'C', 1); //Tamaño
                    //Obtenemos la información de los archivos
                    // Se establece un color de relleno para los encabezados.
                    $pdf->setFillColor(245, 254, 255, 1);
                    $pdf->Ln(5);
                    $cont = 0; //Variable para contar
                    // Se establece la fuente para los encabezados.
                    $pdf->setFont('Times', '', 11); //Fuente de las letras
                }
                $pdf->SetWidths(array(55, 40, 25, 25, 52, 50, 30)); //Seteamos el ancho de las celdas
                $pdf->setHeight(10);
                $pdf->Row(array(utf8_decode($rowArchivos['nombre_original']), utf8_decode($rowArchivos['fecha_subida']), utf8_decode($rowArchivos['tamano']), utf8_decode($rowArchivos['nombre_estado']), utf8_decode($rowArchivos['nombre_empresa']), utf8_decode($rowArchivos['descripcion']), utf8_decode($rowArchivos['tipo'])));
                $pdf->Ln(5);
            }
        } else {
            $pdf->cell(0, 10, utf8_decode('No hay archivos subidos por ti en este momento'), 1, 1);
        }
    } else {
        $pdf->cell(0, 10, utf8_decode('No hay archivos subidos por ti porque eres administrador'), 1, 1);
    }
    header('Content-type: application/pdf');
    $pdf->output('I', 'Reporte resumen de los archivos del empleado: ' . $_SESSION['nombreUsuario'] . $_SESSION['apellidoUsuario'], true);
} else {
    header('location: ../../views/archivosSubidos.html');
}

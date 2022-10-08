<?php
// Se verifica si existe el parámetro id en la url, de lo contrario se direcciona a la página web de origen.
if (1 == 1) {
    require('../helpers/dashboardReport.php');
    require('../models/archivos.php');
    // Se instancia el módelo productos para procesar los datos.
    $archivos = new Archivos;
    // Se instancia la clase para crear el reporte.
    $pdf = new Report;
    $pdf->startReport('Reporte resumen de archivos dentro de folder', 'p');
    //Validando que halla una session
    if(!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] != 4){
        header('location: ../../views/index.html');
    }
    //Obtenemos el nombre de la empresa y el archivo
    if ($rowInfo = $archivos->nombreEmpFol()) {
        //ESPACIO ENTRE CELDA
        $pdf->cell(25, 10, ' ', 0, 0, 'C');
        //Se llenan las celdas con la información del readPedido
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', 'B', 11);
        //Se llenan las celdas con la información obtenida
        $pdf->cell(30, 10, utf8_decode('Empresa :'), 1, 0, 'C', 1); //Nombre de la empresa
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', '', 11);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(245, 254, 255, 1);
        $pdf->cell(50, 10, utf8_decode($rowInfo['nombre_empresa']), 1, 0, 'C', 1); //Nombre de la empresa
        //ESPACIO ENTRE CELDA
        $pdf->cell(3, 10, ' ', 0, 0, 'C');
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', 'B', 11);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        $pdf->cell(30, 10, utf8_decode('Folder :'), 1, 0, 'C', 1); //Nombre del folder
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', '', 11);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(245, 254, 255, 1);
        $pdf->cell(50, 10, utf8_decode($rowInfo['nombre_folder']), 1, 1, 'C', 1); //Nombre del folder
        $pdf->Ln(5);

        //Obtenemos información sobre reportes
        if ($rowArchivos = $archivos->reporteArchivosInf()) {
            //ESPACIO ENTRE CELDA
            $pdf->cell(10, 10, ' ', 0, 0, 'C');
            //Colocamos los encabezados
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11);
            //Se llenan las celdas con la información obtenida
            $pdf->cell(75, 10, utf8_decode('Nombre del archivo'), 1, 0, 'C', 1); //Nombre del archivo
            $pdf->cell(40, 10, utf8_decode('Fecha de subida'), 1, 0, 'C', 1); //Fecha de subida
            $pdf->cell(50, 10, utf8_decode('Tamaño'), 1, 0, 'C', 1); //Tamaño
            $pdf->cell(30, 10, utf8_decode('Tipo'), 1, 1, 'C', 1); //Tamaño
            //Obtenemos la información de los archivos
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(245, 254, 255, 1);
            $pdf->Ln(5);
            $cont = 0; //Variable para contar
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            //Llenamos con la info obtenida
            foreach ($rowArchivos as $rowArchivos) {
                //Evaluamos si se debe poner el encabezado
                $cont++;
                //Evaluamos si el contador esta en 4 que es él número de columnas para cambio  de página
                if ($cont > 12) {
                    $pdf->cell(10, 10, ' ', 0, 0, 'C');
                    //Colocamos los encabezados
                    // Se establece un color de relleno para los encabezados.
                    $pdf->setFillColor(255, 139, 144, 1);
                    // Se establece la fuente para los encabezados.
                    $pdf->setFont('Times', 'B', 11);
                    //Se llenan las celdas con la información obtenida
                    $pdf->cell(75, 10, utf8_decode('Nombre del archivo'), 1, 0, 'C', 1); //Nombre del archivo
                    $pdf->cell(40, 10, utf8_decode('Fecha de subida'), 1, 0, 'C', 1); //Fecha de subida
                    $pdf->cell(50, 10, utf8_decode('Tamaño'), 1, 0, 'C', 1); //Tamaño
                    $pdf->cell(30, 10, utf8_decode('Tipo'), 1, 1, 'C', 1); //Tamaño
                    //Obtenemos la información de los archivos
                    // Se establece un color de relleno para los encabezados.
                    $pdf->setFillColor(245, 254, 255, 1);
                    $pdf->Ln(5);
                    $cont = 0; //Variable para contar
                    // Se establece la fuente para los encabezados.
                    $pdf->setFont('Times', '', 11); //Fuente de las letras
                }
                //ESPACIO ENTRE CELDA
                $pdf->cell(10, 10, ' ', 0, 0, 'C');
                $pdf->SetWidths(array(75, 40, 50, 30)); //Seteamos el ancho de las celdas
                $pdf->setHeight(10);
                $pdf->Row(array(utf8_decode($rowArchivos['nombre_original']), utf8_decode($rowArchivos['fecha_subida']), utf8_decode($rowArchivos['tamano']), utf8_decode($rowArchivos['tipo'])));
                $pdf->Ln(5);
            }
        } else {
            $pdf->cell(0, 10, utf8_decode('No hay archivos registrados en este folder'), 1, 1);
        }
        header('Content-type: application/pdf');
        $pdf->output('I', 'Reporte resumen de los archivos del folder: ' . $rowInfo['nombre_folder'], true);
    } else {
        header('location: ../../views/archivos.html');
    }
} else {
    header('location: ../../views/archivos.html');
}

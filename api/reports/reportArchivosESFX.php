<?php
// Se verifica si existe el parámetro id en la url, de lo contrario se direcciona a la página web de origen.
if (isset($_GET['fechai']) && isset($_GET['fechaf'])) {
    require('../helpers/dashboardReport.php');
    require('../models/archivosSubidosEmp.php');
    // Se instancia el módelo pedidos personalizado para procesar los datos.
    $archivos = new ArchivosSubidosEmp;

    if(!isset($_SESSION['id_usuario'])){
        header('location: ../../views/index.html');
    }

    // Se verifica si el parámetro es un valor correcto, de lo contrario se direcciona a la página web de origen.
    if ($archivos->setFechaSubida($_GET['fechai']) && $archivos->setFechaSubida($_GET['fechaf'])) {
        // Se instancia la clase para crear el reporte.
        $pdf = new Report;
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Empleados que subieron archivos en un rango de fechas', 'p');
        // Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
        /*
            ENCABEZADOS
        */
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        // Se establece la fuente para los encabezados.
        //ESPACIO ENTRE CELDA
        $pdf->cell(30, 10, ' ', 0, 0, 'C');
        $pdf->setFont('Times', 'B', 11);
        $pdf->cell(35, 10, utf8_decode('Fecha inicial: '), 1, 0, 'C', 1);
        $pdf->setFillColor(245, 254, 255, 1);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', '', 11);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(40, 10, utf8_decode($_GET['fechai']), 1, 0, 'C', 1);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        //ESPACIO ENTRE CELDA
        $pdf->cell(3, 10, '', 0, 0, 'C');
        $pdf->setFont('Times', 'B', 11);
        $pdf->cell(35, 10, utf8_decode('Fecha final:'), 1, 0, 'C', 1);
        $pdf->setFillColor(245, 254, 255, 1);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', '', 11);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(40, 10, utf8_decode($_GET['fechaf']), 1, 1, 'C', 1);
        $pdf->Ln(5);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', 'B', 11); //Fuente de las letras
        if ($dataArchivo = $archivos->reporteEmpSFX($_GET['fechai'], $_GET['fechaf'])) {
            /*
                ENCABEZADOS 2
            */
            //ESPACIO ENTRE CELDA
            $pdf->cell(10, 10, ' ', 0, 0, 'C');
            $pdf->cell(100, 10, utf8_decode('Nombre del empleado:'), 1, 0, 'C', 1);
            $pdf->cell(95, 10, utf8_decode('Número de archivos subidos entre fechas:'), 1, 1, 'C', 1);
            $pdf->Ln(5);
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(249, 182, 145, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $cont = 0;
            foreach ($dataArchivo as $rowArchivos) {
                //Evaluamos si se debe poner el encabezado
                $cont++;
                //Evaluamos si el contador esta en 12 que es el número de columnas para cambio  de página
                if ($cont > 11) {
                    /*
                        ENCABEZADOS 2
                    */
                    //ESPACIO ENTRE CELDA
                    $pdf->cell(10, 10, ' ', 0, 0, 'C');
                    $pdf->cell(100, 10, utf8_decode('Nombre del empleado:'), 1, 0, 'C', 1);
                    $pdf->cell(95, 10, utf8_decode('Número de archivos subidos entre fechas:'), 1, 1, 'C', 1);
                    $pdf->Ln(5);
                    // Se establece un color de relleno para los encabezados.
                    $pdf->setFillColor(249, 182, 145, 1);
                    // Se establece la fuente para los encabezados.
                    $pdf->setFont('Times', '', 11); //Fuente de las letras
                    $cont = 0;
                }
                //ESPACIO ENTRE CELDA
                $pdf->cell(10, 10, ' ', 0, 0, 'C');
                $pdf->SetWidths(array(100, 95)); //Seteamos el ancho de las celdas
                $pdf->setHeight(10);
                $pdf->Row(array(utf8_decode($rowArchivos['nombre_empleado']), $rowArchivos['numeros']));
                $pdf->Ln(5);
            }
        } else {
            //ESPACIO ENTRE CELDA
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            $pdf->cell(10, 10, ' ', 0, 0, 'C');
            $pdf->cell(195, 10, utf8_decode('Ningun empleado subio archivos durante esas fechas'), 1, 0, 'C', 1); //Nombre de la empresa
        }
        header('Content-type: application/pdf');
        // Se envía el documento al navegador y se llama al método footer()
        $pdf->output('I', 'Empleados que subieron archivos entre fechas.pdf');
    } else {
        header('location: ../../views/archivosSubidos.html');
    }
} else {
    header('location: ../../views/archivosSubidos.html');
}

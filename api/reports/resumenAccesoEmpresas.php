<?php
// Se verifica si existe el parámetro id en la url, de lo contrario se direcciona a la página web de origen.
if (1 == 1) {
    require('../helpers/dashboardReport.php');
    require('../models/empresas.php');
    // Se instancia el módelo empresas para procesar los datos.
    $empresas = new Empresas;
    // Se instancia la clase para crear el reporte.
    $pdf = new Report;
    $pdf->startReport('Reporte resumen del acceso a las empresas', 'p');
    //Obtenemos la información de los reportes
    if(!isset($_SESSION['id_usuario'])){
        header('location: ../../views/index.html');
    }
    if ($rowEmpresas = $empresas->reportCantidadEmpAcc()) {
        /*
            ENCABEZADOS
        */
        //ESPACIO ENTRE CELDA
        $pdf->cell(10, 10, ' ', 0, 0, 'C');
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', 'B', 11); //Fuente de las letras
        $pdf->cell(95, 10, utf8_decode('Nombre de la empresa:'), 1, 0, 'C', 1); //Nombre de la empresa
        $pdf->cell(100, 10, utf8_decode('Número de empleados que tienen acceso:'), 1, 1, 'C', 1); //Nombre de la empresa
        $pdf->Ln(5);
        // Se establece un color de relleno para los datos
        $pdf->setFillColor(245, 254, 255, 1);
        $cont = 0; //Variable contador
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Times', '', 11); //Fuente de las letras
        //Llenamos con la información retornada
        foreach ($rowEmpresas as $rowEmpresas) {
            //Evaluamos si se debe poner el encabezado
            $cont++;
            //Evaluamos si el contador esta en 12 que es el número de columnas para cambio  de página
            if ($cont > 12) {
                $pdf->cell(10, 10, ' ', 0, 0, 'C');
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(255, 139, 144, 1);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Times', 'B', 11); //Fuente de las letras
                $pdf->cell(95, 10, utf8_decode('Nombre de la empresa:'), 1, 0, 'C', 1); //Nombre de la empresa
                $pdf->cell(100, 10, utf8_decode('Número de empleados que tienen acceso:'), 1, 1, 'C', 1); //Nombre de la empresa
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
            $pdf->SetWidths(array(95, 100)); //Seteamos el ancho de las celdas
            $pdf->setHeight(10);
            $pdf->Row(array(utf8_decode($rowEmpresas['nombre_empresa']), $rowEmpresas['acceso']));
            $pdf->Ln(5);
        }
    } else {
        //ESPACIO ENTRE CELDA
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        $pdf->cell(10, 10, ' ', 0, 0, 'C');
        $pdf->cell(195, 10, utf8_decode('No hay empresas almacenadas'), 1, 0, 'C', 1); //Nombre de la empresa
    }
    $pdf->output('I', 'Reporte resumen del acceso a las empresas', true);
} else {
    header('location: ../../views/empresas.html');
}

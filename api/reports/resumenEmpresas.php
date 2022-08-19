<?php
// Se verifica si existe el parámetro id en la url, de lo contrario se direcciona a la página web de origen.
if (1 == 1) {
    require('../helpers/dashboardReport.php');
    require('../models/empresas.php');
    // Se instancia el módelo productos para procesar los datos.
    $empresas = new Empresas;
    // Se instancia la clase para crear el reporte.
    $pdf = new Report;
    $pdf->startReport('Reporte resumen de las empresas registradas', 'l');
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(255, 139, 144, 1);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Times', 'B', 11);
    //ESPACIO ENTRE CELDA
    $pdf->cell(20, 10, ' ', 0, 0, 'C');
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(55, 10, utf8_decode('Nombre empresa'), 1, 0, 'C', 1);
    $pdf->cell(45, 10, utf8_decode('Nombre cliente'), 1, 0, 'C', 1);
    $pdf->cell(45, 10, utf8_decode('Apellido cliente'), 1, 0, 'C', 1);
    $pdf->cell(45, 10, utf8_decode('NIT o DUIT empresa'), 1, 0, 'C', 1);
    $pdf->cell(45, 10, utf8_decode('Num. contacto empresa'), 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(245, 254, 255, 1);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Times', '', 11);

    $pdf->Ln(5);
    $cont = 0;
    //Obtenemos los datos
    if ($dataEmpresas  = $empresas->obtenerEmpresas()) {
        // Se recorren los registros ($dataProductos) fila por fila ($rowEmpresas).
        foreach ($dataEmpresas as $rowEmpresas) {
            $cont++;
            //Validar si ya se debe hacer cambio de página
            if ($cont > 8) {
                // Se establece un color de relleno para los encabezados.
                $pdf->setFillColor(255, 139, 144, 1);
                // Se establece la fuente para los encabezados.
                $pdf->setFont('Times', 'B', 11);
                //ESPACIO ENTRE CELDA
                $pdf->cell(20, 10, ' ', 0, 0, 'C');
                // Se imprimen las celdas con los encabezados.
                $pdf->cell(55, 10, utf8_decode('Nombre empresa'), 1, 0, 'C', 1);
                $pdf->cell(45, 10, utf8_decode('Nombre cliente'), 1, 0, 'C', 1);
                $pdf->cell(45, 10, utf8_decode('Apellido cliente'), 1, 0, 'C', 1);
                $pdf->cell(45, 10, utf8_decode('NIT o DUIT empresa'), 1, 0, 'C', 1);
                $pdf->cell(45, 10, utf8_decode('Num. contacto empresa'), 1, 1, 'C', 1);

                // Se establece un color de relleno para mostrar el nombre de la categoría.
                $pdf->setFillColor(245, 254, 255, 1);
                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Times', '', 11);

                $pdf->Ln(5);
                $cont = 0;
            }

            //ESPACIO ENTRE CELDA
            $pdf->cell(20, 10, ' ', 0, 0, 'C');
            // Se imprimen las celdas con los datos de los productos.
            $pdf->cell(55, 10, utf8_decode($rowEmpresas['nombre_empresa']), 1, 0, 'C', 1);
            $pdf->cell(45, 10, utf8_decode($rowEmpresas['nombre_cliente']), 1, 0, 'C', 1);
            $pdf->cell(45, 10, utf8_decode($rowEmpresas['apellido_cliente']), 1, 0, 'C', 1);
            $pdf->cell(45, 10, $rowEmpresas['nit_empresa'], 1, 0, 'C', 1);
            $pdf->cell(45, 10, $rowEmpresas['numero_empresacontc'], 1, 1, 'C', 1);
            $pdf->Ln(5);
        }
    } else {
        //ESPACIO ENTRE CELDA
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(255, 139, 144, 1);
        $pdf->cell(10, 10, ' ', 0, 0, 'C');
        $pdf->cell(195, 10, utf8_decode('No hay ninguna empresa registrada'), 1, 0, 'C', 1); //Nombre de la empresa
    }
    $pdf->output('I', 'Reporte resumen de las empresas registradas no eliminadas', true);
} else {
    header('location: ../../views/empresas.html');
}

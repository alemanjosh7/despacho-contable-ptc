<?php
require('../helpers/dashboard_report.php');
require('../models/archivosSubidosEmp.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Empleados con mas registro de archivos', 'p');
// Se establece un color de relleno para los encabezados.
$pdf->setFillColor(255, 139, 144, 1);
// Se establece la fuente para los encabezados.
$pdf->setFont('Times', 'B', 11);
// Se imprimen las celdas con los encabezados.
$pdf->cell(55, 10, utf8_decode('Nombre empleado'), 1, 0, 'C', 1);
$pdf->cell(45, 10, utf8_decode('Apellido empleado'), 1, 0, 'C', 1);
$pdf->cell(45, 10, utf8_decode('Archivos registrados'), 1, 0, 'C', 1);

// Se establece un color de relleno para mostrar el nombre de la categoría.
$pdf->setFillColor(255, 139, 144, 1);
// Se establece la fuente para los datos de los productos.
$pdf->setFont('Times', '', 11);
$archivosub = new ArchivosSubidosEmp;
// Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
if ($dataArchivoSub = $archivosub->registroArchivoEmpleado()) {
    // Se recorren los registros ($dataProductos) fila por fila ($rowArchivos).
    foreach ($dataArchivoSub as $rowArchivoSub) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(55, 10, utf8_decode($rowArchivoSub['nombre_empleado']), 1, 0, 'C');
        $pdf->cell(55, 10, utf8_decode($rowArchivoSub['apellido_empleado']), 1, 0, 'C');
        $pdf->cell(55, 10, utf8_decode($rowArchivoSub['subidas']), 1, 0, 'C');
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay registros disponibles'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'registroArchivos.pdf');
<?php
require('../helpers/dashboard_report.php');
require('../models/empleados.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Empleados sin acceso a empresas', 'p');
// Se establece un color de relleno para los encabezados.
$pdf->setFillColor(255, 139, 144, 1);
// Se establece la fuente para los encabezados.
$pdf->setFont('Times', 'B', 11);
// Se imprimen las celdas con los encabezados.
$pdf->cell(35, 10, utf8_decode('ID Empleado'), 1, 0, 'C', 1);
$pdf->cell(45, 10, utf8_decode('Nombre Empleado'), 1, 0, 'C', 1);
$pdf->cell(45, 10, utf8_decode('Apellido Empleado'), 1, 0, 'C', 1);

// Se establece un color de relleno para mostrar el nombre de la categoría.
$pdf->setFillColor(255, 139, 144, 1);
// Se establece la fuente para los datos de los productos.
$pdf->setFont('Times', '', 11);
$empleado = new Empleados;
// Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
if ($dataEmpleado = $empleado->accesoEmpleadosEmp()) {
    // Se recorren los registros ($dataProductos) fila por fila ($rowArchivos).
    foreach ($dataEmpleado as $rowEmpleado) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(35, 10, utf8_decode($rowEmpleado['id_empleado']), 1, 0, 'C');
        $pdf->cell(45, 10, utf8_decode($rowEmpleado['nombre_empleado']), 1, 0, 'C');
        $pdf->cell(45, 10, utf8_decode($rowEmpleado['apellido_empleado']), 1, 0, 'C');
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay registros disponibles'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'accesoEmpleados.pdf');
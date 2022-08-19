<?php
require('../helpers/dashboardReport.php');
require('../models/empleados.php');
require('../models/empresas.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Empleados con acceso a empresas', 'p');
$empleado = new Empleados;
$empresa = new Empresas;
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
$pdf->output('I', 'accesoEmpleados.pdf');

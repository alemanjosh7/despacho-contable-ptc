<?php
require('../helpers/dashboard_report.php');
require('../models/empresas.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Empresas registradas', 'p');
// Se establece un color de relleno para los encabezados.
$pdf->setFillColor(255, 139, 144, 1);
// Se establece la fuente para los encabezados.
$pdf->setFont('Times', 'B', 11);
// Se imprimen las celdas con los encabezados.
$pdf->cell(55, 10, utf8_decode('Nombre empresa'), 1, 0, 'C', 1);
$pdf->cell(45, 10, utf8_decode('Nombre cliente'), 1, 0, 'C', 1);
$pdf->cell(45, 10, utf8_decode('Apellido cliente'), 1, 0, 'C', 1);
$pdf->cell(45, 10, utf8_decode('NIT empresa'), 1, 1, 'C', 1);
$pdf->cell(45, 10, utf8_decode('Num. contacto empresa'), 1, 1, 'C', 1);
if(!isset($_SESSION['id_usuario'])){
    header('location: ../../views/index.html');
}
// Se establece un color de relleno para mostrar el nombre de la categoría.
$pdf->setFillColor(255, 139, 144, 1);
// Se establece la fuente para los datos de los productos.
$pdf->setFont('Times', '', 11);
$empresa = new Empresas;
// Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
if ($dataEmpresas = $empresa->registroEmpresas()) {
    // Se recorren los registros ($dataProductos) fila por fila ($rowEmpresas).
    foreach ($dataEmpresas as $rowEmpresas) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(55, 10, utf8_decode($rowEmpresas['nombre_empresa']), 1, 0, 'C');
        $pdf->cell(55, 10, utf8_decode($rowEmpresas['nombre_cliente']), 1, 0, 'C');
        $pdf->cell(55, 10, utf8_decode($rowEmpresas['apellido_cliente']), 1, 0, 'C');
        $pdf->cell(30, 10, $rowEmpresas['nit_empresa'], 1, 0, 'C');
        $pdf->cell(46, 10, $rowEmpresas['numero_empresacontc'], 1, 1, 'C'); 
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay registros disponibles'), 1, 1);
}
header('Content-type: application/pdf');
// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'registroEmpresas.pdf');
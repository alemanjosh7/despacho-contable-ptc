<?php
// Se verifica si existe el parámetro id en la url, de lo contrario se direcciona a la página web de origen.
if (isset($_GET['idemp'])) {
    require('../helpers/dashboardReport.php');
    require('../models/empresas.php');
    // Se instancia el módelo pedidos personalizado para procesar los datos.
    $empresas = new Empresas;
    if(!isset($_SESSION['id_usuario'])){
        header('location: ../../views/index.html');
    }
    // Se verifica si el parámetro es un valor correcto, de lo contrario se direcciona a la página web de origen.
    if ($empresas->setId($_GET['idemp'])) {
        // Se instancia la clase para crear el reporte.
        $pdf = new Report;
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Folders y el número de archivos que poseen', 'p');
        //Se verifica que la empresa existe
        if ($dataEmpresa = $empresas->checkReportEmp($_GET['idemp'])) {
            /*
                ENCABEZADOS
            */
            //ESPACIO ENTRE CELDA

            //Nombre de la empresa, DUI o NIT y telefono

            $pdf->cell(10, 10, ' ', 0, 0, 'C');
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode('Nombre de la empresa:'), 1, 0, 'C', 1); //Nombre de la empresa
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode($dataEmpresa[0]['nombre_empresa']), 1, 0, 'C', 1); //Nombre de la empresa
            //ESPACIO ENTRE CELDA
            $pdf->cell(5, 10, ' ', 0, 0, 'C');
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);

            //Analizando si es NIT o DUI

            if (strlen($dataEmpresa[0]['nit_empresa']) <= 10) {
                $nitDui = 'DUIT';
            } else {
                $nitDui = 'NIT';
            }

            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(25, 10, utf8_decode($nitDui), 1, 0, 'C', 1); //DUI o NIT de la empresa
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->cell(25, 10, utf8_decode($dataEmpresa[0]['nit_empresa']), 1, 0, 'C', 1); //DUI o NIT de la empresa
            //ESPACIO ENTRE CELDA
            $pdf->cell(5, 10, ' ', 0, 0, 'C');
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(20, 10, utf8_decode('Teléfono:'), 1, 0, 'C', 1); //Telefono de la empresa
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->cell(25, 10, utf8_decode($dataEmpresa[0]['numero_empresacontc']), 1, 1, 'C', 1); //Telefono de la empresa
            $pdf->Ln(5);

            //Nombre y apellido del empleado

            $pdf->cell(10, 10, ' ', 0, 0, 'C');
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode('Nombre del cliente:'), 1, 0, 'C', 1); //Nombre del cliente
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode($dataEmpresa[0]['nombre_cliente']), 1, 0, 'C', 1); //Nombre del cliente
            $pdf->cell(5, 10, ' ', 0, 0, 'C');
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode('Apellido del cliente:'), 1, 0, 'C', 1); //Apellido de la empresa
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->cell(55, 10, utf8_decode($dataEmpresa[0]['apellido_cliente']), 1, 1, 'C', 1); //Apellido de la empresa
            $pdf->Ln(5);

            //Correo y direccion
            $pdf->cell(10, 10, ' ', 0, 0, 'C');
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode('Correo de la empresa:'), 1, 0, 'C', 1); //Correo de la empresa
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode($dataEmpresa[0]['correo_empresacontc']), 1, 0, 'C', 1); //Correo de la empresa
            $pdf->cell(5, 10, ' ', 0, 0, 'C');
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(45, 10, utf8_decode('Número de folders:'), 1, 0, 'C', 1); //Número de folders de la empresa
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->cell(55, 10, utf8_decode($dataEmpresa[0]['folders']), 1, 1, 'C', 1); //Número de folders de la empresa
            $pdf->Ln(5);

            //Dirección de la empresa
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 139, 144, 1);
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $x = 11.5;
            $y = 95;
            $pdf->SetXY($x, $y);
            $pdf->MultiCell(45, 30, utf8_decode('Correo:'), 1, 'C', 1);
            $pdf->SetXY($x + 45, $y);
            $pdf->setFillColor(245, 254, 255, 1);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Times', '', 11); //Fuente de las letras
            $pdf->MultiCell(150, 30, utf8_decode($dataEmpresa[0]['direccion_empresa']), 1, 'C', 1);
            $pdf->Ln(5);

            /*
                ENCABEZADOS 2
            */

            $pdf->cell(25, 10, ' ', 0, 0, 'C');
            $pdf->setFillColor(245, 254, 255, 1);
            $pdf->setFont('Times', 'B', 11); //Fuente de las letras
            $pdf->cell(55, 10, utf8_decode('Nombre del folder:'), 1, 0, 'C', 1);
            $pdf->cell(105, 10, utf8_decode('Número de archivos:'), 1, 1, 'C', 1);
            $pdf->setFillColor(249, 182, 145, 1);
            $pdf->Ln(5);

            $cont = 0;
            $pag1 = true;

            if ($rowFolders = $empresas->reportFAEmp($_GET['idemp'])) {
                //Llenamos con la información retornada
                foreach ($rowFolders as $rowFolders) {
                    $cont++;
                    if ($pag1 == true && $cont > 9) {
                        $pdf->cell(25, 10, ' ', 0, 0, 'C');
                        $pdf->setFillColor(245, 254, 255, 1);
                        $pdf->setFont('Times', 'B', 11); //Fuente de las letras
                        $pdf->cell(55, 10, utf8_decode('Nombre del folder:'), 1, 0, 'C', 1);
                        $pdf->cell(105, 10, utf8_decode('Número de archivos:'), 1, 1, 'C', 1);
                        $pdf->setFillColor(249, 182, 145, 1);
                        $pdf->Ln(5);

                        $cont = 0;
                    } elseif ($cont > 12) {
                        $pdf->cell(25, 10, ' ', 0, 0, 'C');
                        $pdf->setFillColor(245, 254, 255, 1);
                        $pdf->setFont('Times', 'B', 11); //Fuente de las letras
                        $pdf->cell(55, 10, utf8_decode('Nombre del folder:'), 1, 0, 'C', 1);
                        $pdf->cell(105, 10, utf8_decode('Número de archivos:'), 1, 1, 'C', 1);
                        $pdf->setFillColor(249, 182, 145, 1);
                        $pdf->Ln(5);

                        $cont = 0;
                    }

                    //ESPACIO ENTRE CELDA
                    $pdf->cell(25, 10, ' ', 0, 0, 'C');
                    $pdf->SetWidths(array(55, 105)); //Seteamos el ancho de las celdas
                    $pdf->setHeight(10);
                    $pdf->Row(array(utf8_decode($rowFolders['nombre_folder']), $rowFolders['total']));
                    $pdf->Ln(5);
                }
            } else {
                $pdf->cell(25, 10, ' ', 0, 0, 'C');
                $pdf->setFillColor(249, 182, 145, 1);
                $pdf->setFont('Times', 'B', 11); //Fuente de las letras
                $pdf->cell(160, 10, utf8_decode('No hay folders registrados en esta empresa'), 1, 1, 'C', 1);
            }


            $pdf->output('I', 'Reporte sobre el número de folders y los archivos de la empresa: ' . $dataEmpresa[0]['nombre_empresa'], true);
        } else {
            header('location: ../../views/empresas.html');
        }
    } else {
        header('location: ../../views/empresas.html');
    }
} else {
    header('location: ../../views/empresas.html');
}

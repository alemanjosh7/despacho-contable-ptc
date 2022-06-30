<?php
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../models/archivosSubidos.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $archivosub = new archivosSubidos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $archivosub->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay archivos registrados';
                }
                break;
            case 'readAllEmp':
                if ($result['dataset'] = $archivosub->readAllEmp()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay empresas registradas';
                }
                break;
            case 'search':
                $_POST = $archivosub->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $archivosub->searchArchivoSub($_POST['search'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                $_POST = $archivosub->validateForm($_POST);
                if (!$archivosub->setDescripcion($_POST['descripcion-arch'])) {
                    $result['exception'] = 'Descripcion incorrecta';
                } elseif (!$archivosub->setIdEmpleado($_SESSION['id_usuario'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$archivosub->setIdEmpresa($_POST['cmbEmpresa'])) {
                    $result['exception'] = 'Empresa incorrecto';
                } elseif (!$archivosub->setNombreOriginal($_POST['nombreArchivo-orgnl'])) {
                    $result['exception'] = 'Nombre original incorrecto';
                } elseif (!is_uploaded_file($_FILES['archivosubido-arch']['tmp_name'])) {
                    $result['exception'] = 'Seleccione un archivo';
                } elseif (!$archivosub->setNombreArchivo($_FILES['archivosubido-arch'])) {
                    $result['exception'] = $archivosub->getFileError();
                } elseif ($archivosub->insertarArchivoSub()) {
                    $result['status'] = 1;
                    if ($archivosub->saveFile($_FILES['archivosubido-arch'], $archivosub->getRuta(), $archivosub->getNombreArchivo())) {
                        $result['message'] = 'Archivo añadido correctamente';
                    } else {
                        $result['message'] = 'Producto creado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if (!$archivosub->setIdArchivo($_POST['id'])) {
                    $result['exception'] = 'Archivo incorrecto';
                } elseif (!$data = $archivosub->readOne()) {
                    $result['exception'] = 'Archivo inexistente';
                } elseif ($archivosub->eliminarArchivoSub()) {
                    $result['status'] = 1;
                    if ($archivosub->deleteFile($archivosub->getRuta(), $data['nombre_archivo'])) {
                        $result['message'] = 'Archivo eliminado correctamente';
                    } else {
                        $result['message'] = 'Producto eliminado pero no se borró la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
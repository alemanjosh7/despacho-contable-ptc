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
                if (!$archivosub->setNombreArchivo($_POST['nombres'])) {
                    $result['exception'] = 'Nombres incorrectos';
                } elseif (!$archivosub->setFechaSubida($_POST['fecha'])) {
                    $result['exception'] = 'Fecha incorrecta';
                } elseif (!$archivosub->setDescripcion($_POST['descripcion'])) {
                    $result['exception'] = 'Descripcion incorrecta';
                } elseif (!$archivosub->setIdEmpleado($_POST['fkEmpleado'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$archivosub->setIdEmpresa($_POST['fkEmpresa'])) {
                    $result['exception'] = 'Empresa incorrecto';
                } elseif (!$archivosub->setIdEstado($_POST['fkEstado'])) {
                    $result['exception'] = 'Estado incorrecto';
                } elseif (!$archivosub->setTamano($_POST['tamano'])) {
                    $result['exception'] = 'Tamaño incorrecto';
                } elseif (!$archivosub->setNombreOriginal($_POST['nombreOriginal'])) {
                    $result['exception'] = 'Nombre original incorrecto';
                } elseif ($archivosub->insertarArchivoSub()) {
                    $result['status'] = 1;
                    $result['message'] = 'Archivo añadido correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'update':
                $_POST = $archivosub->validateForm($_POST);
                if (!$archivosub->setId($_POST['id'])) {
                    $result['exception'] = 'Cliente incorrecto';
                } elseif (!$archivosub->obtenerCliente()) {
                    $result['exception'] = 'Cliente inexistente';
                } elseif (!$archivosub->setNombre($_POST['nombre'])) {
                    $result['exception'] = 'Nombres invalido';
                } elseif (!$archivosub->setApellido($_POST['apellido'])) {
                    $result['exception'] = 'Apellidos invalido';
                } elseif (!$archivosub->setCorreo($_POST['correo'])) {
                    $result['exception'] = 'Correo invalido';
                } elseif (!$archivosub->setDUI($_POST['dui'])) {
                    $result['exception'] = 'DUI invalido';
                } elseif (!$archivosub->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'Telefono invalido';
                } elseif (!$archivosub->setUsuario($_POST['usuario'])) {
                    $result['exception'] = 'Usuario invalido';
                } elseif (!$archivosub->setDireccion($_POST['direccion'])) {
                    $result['exception'] = 'Direccion invalida';
                } elseif (!$archivosub->setEstado(isset($_POST['estado']) ? 8 : 9)) {
                    $result['exception'] = 'DUI invalido';
                } elseif ($archivosub->actualizarCliente()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente modificado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if (!$archivosub->setIdArchivo($_POST['id'])) {
                    $result['exception'] = 'Archivo incorrecto';
                } elseif ($archivosub->eliminarArchivoSub()) {
                    $result['status'] = 1;
                    $result['message'] = 'Archivo eliminado correctamente';
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
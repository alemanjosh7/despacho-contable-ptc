<?php
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../models/tipoEmpleado.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tipoEmpleado = new tipoEmpleado;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'getUser':
                if (isset($_SESSION['alias_empleado'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['alias_empleado'];
                } else {
                    $result['exception'] = 'Alias de administrador indefinido';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'obtenerTipoEmpleado':
                if ($result['dataset'] = $tipoEmpleado->obtenerTipoEmpleado()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
                //Log in
            case 'logIn':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->checkUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Nombre de usuario incorrecto';
                } elseif (!$empleados->checkEmpleadosActivos()) {
                    $result['exception'] = 'Nombre de usuario eliminado o bloqueado, comunicate con tu administrador';
                } elseif ($empleados->checkContrasenaEmpleado($_POST['contrasena'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                    $_SESSION['id_usuario'] = $empleados->getId();
                    $_SESSION['usuario'] = $empleados->getUsuario();
                    $_SESSION['saludoI'] = false;
                    $empleados->nombreApellidoEmpleado();
                    $empleados->tipoEmpleado();
                } else {
                    $result['exception'] = 'Contraseña incorrecta';
                }
                break;
                //Actualizar la contraseña
            case 'actualizarContra':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->checkUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Usuario inexistente';
                } elseif (!$empleados->setContrasena($_POST['contrasena'])) {
                    $result['exception'] = $empleados->getPasswordError();
                } elseif ($empleados->cambiarContrasenaEmpleado()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['exception'] = 'La contraseña no se pudo actualizar';
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

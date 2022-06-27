<?php
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../models/empleados.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $empleados = new Empleados;
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
            case 'nombreApellido':
                if ($result['dataset'] = $admins->nombreApellidoEmpleado()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo obtener la información necesaria para el saludo';
                }
                break;
            case 'obtenerTipoEmpleado':
                if ($result['dataset'] = $empleados->obtenerTipoEmpleado()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'readAllLimit':
                if ($result['dataset'] = $empleados->buscarEmpleadosLimite($_SESSION['id_usuario'], $_POST['limit'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                $_POST = $empleados->validateForm($_POST);
                if ($_POST['input-file'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $empleados->buscarEmpleados($_SESSION['id_usuario'], $_POST['input-file'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->setNombre($_POST['nombre-emp'])) {
                    $result['exception'] = 'Nombre incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } else if (!$empleados->setApellido($_POST['apellido-emp'])) {
                    $result['exception'] = 'Apellidoincorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setUsuario($_POST['usuario-emp'])) {
                    $result['exception'] = 'Usuario incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setContrasena($_POST['contra-emp'])) {
                    $result['exception'] = 'Contraseña incorrecta';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!isset($_POST['tipo-de-empleado'])) {
                    $result['exception'] = 'Seleccione un tipo de empleado';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setIdTipoEmpleado($_POST['tipo-de-empleado'])) {
                    $result['exception'] = 'Tipo de empleado incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setDUI($_POST['dui-emp'])) {
                    $result['exception'] = 'DUI incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setTelefono($_POST['telefono-emp'])) {
                    $result['exception'] = 'Teléfono incorrecto';
                    $result['message'] = $_POST['telefono-emp'];
                } elseif (!$empleados->setCorreo($_POST['correo-emp'])) {
                    $result['exception'] = 'Correo incorrecto';
                } elseif ($empleados->crearEmpleado()) {
                    $result['status'] = 1;
                } else {
                    $result['message'] = 'hi';
                    $result['exception'] = Database::getException();
                }
                break;
            case 'update':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->setId($_POST['id'])) {
                    $result['exception'] = 'Empleado incorrecto';
                    $result['message'] = $_POST['id'];
                } elseif (!$data = $empleados->obtenerEmpleado($_POST['id'])) {
                    $result['exception'] = 'Empleado inexistente';
                } else if (!$empleados->setNombre($_POST['nombre-emp'])) {
                    $result['exception'] = 'Nombre incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } else if (!$empleados->setApellido($_POST['apellido-emp'])) {
                    $result['exception'] = 'Apellidoincorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setUsuario($_POST['usuario-emp'])) {
                    $result['exception'] = 'Usuario incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } else if (!$data = $empleados->obtenerContra($_POST['id'])) {
                    $result['exception'] = 'Contra inexistente';
                } elseif (($_POST['contra-emp'] != '' && !$empleados->setContrasena($_POST['contra-emp'])) || (!$empleados->setContrasena($empleados->getContrasena()))) {
                    $result['exception'] = 'Contra incorrecta';
                    $result['message'] = $data['contrasena_empleado'];
                } elseif (!isset($_POST['tipo-de-empleado'])) {
                    $result['exception'] = 'Seleccione un tipo de empleado';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setIdTipoEmpleado($_POST['tipo-de-empleado'])) {
                    $result['exception'] = 'Tipo de empleado incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setDUI($_POST['dui-emp'])) {
                    $result['exception'] = 'DUI incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setTelefono($_POST['telefono-emp'])) {
                    $result['exception'] = 'Teléfono incorrecto';
                    $result['message'] = $_POST['telefono-emp'];
                } elseif (!$empleados->setCorreo($_POST['correo-emp'])) {
                    $result['exception'] = 'Correo incorrecto';
                } elseif ($empleados->actualizarEmpleado()) {
                    $result['status'] = 1;
                } else {
                    $result['message'] = 'hi';
                    $result['exception'] = Database::getException();
                }
                break;
            case 'obtenerEmpleado':
                if (!$empleados->setId($_POST['id'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif ($result['dataset'] = $empleados->obtenerEmpleado($_POST['id'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Empleado inexistente';
                }
                break;
            case 'delete':
                if (!$empleados->setId($_POST['id'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$data = $empleados->obtenerEmpleado($_POST['id'])) {
                    $result['exception'] = 'Empleado inexistente';
                } elseif ($empleados->eliminarEmpleado($_POST['id'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado eliminado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesióna';
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
                $message['message'] = 'hi';
        }
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}

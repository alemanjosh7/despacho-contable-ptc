<?php
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../models/tareasEmpleados.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tareas = new TareasEmp;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])  && $_SESSION['verifyP2']) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                //Leer todas las tareas y los empleados
            case 'readEmpTask':
                if (!$tareas->setIdTarea($_POST['idtask'])) {
                    $result['exception'] = 'Id de tarea Incorrecto';
                } elseif (!$tareas->obtenerTarea($_POST['idtask'])) {
                    $result['exception'] = 'Tarea inexistente';
                } elseif ($result['dataset'] = $tareas->empleadosTarea()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tareas asignadas encontradas';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = '¡Lo sentimos! No hay empleados asignados';
                }
                break;
                //Añadir empleado a tarea
            case 'createASG':
                if (!$tareas->obtenerEmpleado($_POST['idemp'])) {
                    $result['exception'] = 'Empleado inexistente';
                } elseif (!$tareas->setIdEmpleado($_POST['idemp'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$tareas->setIdTarea($_POST['idtask'])) {
                    $result['exception'] = 'Tarea incorrecta';
                } elseif ($tareas->anadirEmp()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado asignado correctamente';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = '¡Lo sentimos! No se pudo asignar el empleado';
                }
                break;
            case 'deleteASG':
                if (!$tareas->obtenerEmpleado($_POST['idemp'])) {
                    $result['exception'] = 'Empleado inexistente';
                } elseif (!$tareas->setIdEmpleado($_POST['idemp'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$tareas->setIdTarea($_POST['idtask'])) {
                    $result['exception'] = $_POST['idtask'];
                } elseif ($tareas->eliminarEmpTSK()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado eliminado de la asignación';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = '¡Lo sentimos! No se pudo eliminar el empleado de la asignación';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        $result['exception'] = 'Necesita loguearse';
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}

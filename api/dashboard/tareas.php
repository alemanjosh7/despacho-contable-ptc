<?php
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../models/tareas.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tareas = new Tareas;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])  && $_SESSION['verifyP2']) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                //Leer todo pero con limite
            case 'readAllLimit':
                //Comprobamos si es administrador para cargar todas las empresas o solo seleccionadas
                if ($_SESSION['tipo_usuario'] == 4) {
                    if ($result['dataset'] = $tareas->obtenerTareasLimit($_POST['limit'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Tareas encontradas';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = '¡Lo sentimos! No hay asignaciones registradas';
                    }
                } else {
                    if ($result['dataset'] = $tareas->obtenerTareasAsignadas($_POST['limit'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Tareas encontradas';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = '¡Lo sentimos! No hay asignaciones registradas';
                    }
                }
                break;
            case 'create':
                //Comprobamos si es administrador para proceder con la creación
                if ($_SESSION['tipo_usuario'] == 4) {
                    $_POST = $tareas->validateForm($_POST);
                    if (!isset($_POST['observacion'])) {
                        $_POST['observacion'] = 'null';
                    }
                    if (!isset($_POST['apartado'])) {
                        $_POST['apartado'] = 'null';
                    }
                    if (!isset($_POST['empresa'])) {
                        $_POST['empresa'] = 'null';
                    }
                    if (!isset($_POST['folder'])) {
                        $_POST['folder'] = 'null';
                    }

                    try {
                        if (!$tareas->setObservacion($_POST['observacion'])) {
                        }
                        if (!$tareas->setApartado($_POST['apartado'])) {
                        }
                        if (!$tareas->setIdEmpresa($_POST['empresa']) && !$tareas->checkEmpresa($_POST['empresa'])) {
                        }
                        if (!$tareas->setIdFolder($_POST['folder']) && !$tareas->checkFolder($_POST['folder'])) {
                        }
                    } catch (Exception $e) {
                    }

                    if (!$tareas->setAsignacion($_POST['asignacion'])) {
                        $result['exception'] = 'Asignación invalida';
                    } elseif (!$tareas->setFechaL($_POST['fecha_lmt'])) {
                        $result['exception'] = 'Fecha limite invalida';
                    } elseif ($tareas->crearTarea()) {
                        if ($result['dataset'] = $tareas->getLastTask()) {
                            $result['status'] = 1;
                            $result['message'] = 'Asignación creada, si lo desea asigne empleados';
                        } else {
                            $result['exception'] = '¡Lo sentimos! La tarea se perdió entre las demás, inténtalo de nuevo';
                        }
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = '¡Lo sentimos! No se pudo crear la tarea';
                    }
                } else {
                    $result['exception'] = '¿Que haces?, no deberías hacer esto';
                }
                break;
                //Rechazar una tarea
            case 'rejectTask':
                if (!$_SESSION['tipo_usuario'] == 4) {
                    $result['exception'] = 'No deberías de estar intentando esto';
                } elseif (!$tareas->setId($_POST['idtask'])) {
                    $result['exception'] = 'Tarea incorrecta';
                } elseif (!$tareas->obtenerTarea()) {
                    $result['exception'] = 'Tarea inexistente';
                } elseif ($tareas->rechazarTarea()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tarea rechazada con éxito, se recomiendo modificar y añadir una observación';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = '¡Lo sentimos! No se pudo rechazar la tarea';
                }
                break;
                //Eliminar una tarea
            case 'delete':
                if (!$_SESSION['tipo_usuario'] == 4) {
                    $result['exception'] = 'No deberías de estar intentando esto';
                } elseif (!$tareas->setId($_POST['idtask'])) {
                    $result['exception'] = 'Tarea incorrecta';
                } elseif (!$tareas->obtenerTarea()) {
                    $result['exception'] = 'Tarea inexistente';
                } elseif ($tareas->eliminarTarea()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tarea eliminada con éxito';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = '¡Lo sentimos! No se pudo eliminar la tarea';
                }
                break;
                //Caso de busqueda
            case 'search':
                //Comprobamos si es administrador para cargar todas las empresas o solo seleccionadas
                if ($_SESSION['tipo_usuario'] == 4) {
                    $_POST = $tareas->validateForm($_POST);
                    if ($_POST['search'] == '') {
                        $result['exception'] = 'Ingrese un valor para buscar';
                    } elseif ($result['dataset'] = $tareas->buscarTareas($_POST['search'], $_POST['limit'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Valor encontrado';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No hay coincidencias';
                    }
                } else {
                    $_POST = $tareas->validateForm($_POST);
                    if ($_POST['search'] == '') {
                        $result['exception'] = 'Ingrese un valor para buscar';
                    } elseif ($result['dataset'] = $tareas->buscarTareasASG($_POST['search'], $_POST['limit'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Valor encontrado';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No hay coincidencias';
                    }
                }
                break;
                //Obtener tarea
            case 'getTarea':
                $_POST = $tareas->validateForm($_POST);
                if (!$_SESSION['tipo_usuario'] == 4) {
                    $result['exception'] = 'No deberías de estar intentando esto';
                } elseif (!$tareas->setId($_POST['idtask'])) {
                    $result['exception'] = 'Tarea incorrecta';
                } elseif ($result['dataset'] = $tareas->obtenerTarea()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tarea encontrada';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = '¡Lo sentimos! No se pudo rechazar la tarea';
                }
                break;
            case 'update':
                //Comprobamos si es administrador para proceder con la creación
                if ($_SESSION['tipo_usuario'] == 4) {
                    $_POST = $tareas->validateForm($_POST);
                    if (!isset($_POST['observacion'])) {
                        $_POST['observacion'] = 'null';
                    }
                    if (!isset($_POST['apartado'])) {
                        $_POST['apartado'] = 'null';
                    }
                    if (!isset($_POST['empresa'])) {
                        $_POST['empresa'] = 'null';
                    }
                    if (!isset($_POST['folder'])) {
                        $_POST['folder'] = 'null';
                    }

                    try {
                        if (!$tareas->setObservacion($_POST['observacion'])) {
                        }
                        if (!$tareas->setApartado($_POST['apartado'])) {
                        }
                        if (!$tareas->setIdEmpresa($_POST['empresa']) && !$tareas->checkEmpresa($_POST['empresa'])) {
                        }
                        if (!$tareas->setIdFolder($_POST['folder']) && !$tareas->checkFolder($_POST['folder'])) {
                        }
                    } catch (Exception $e) {
                    }

                    if (!$tareas->setAsignacion($_POST['asignacion'])) {
                        $result['exception'] = 'Asignación invalida';
                    } elseif (!$tareas->setFechaL($_POST['fecha_lmt'])) {
                        $result['exception'] = 'Fecha limite invalida';
                    } elseif (!$tareas->setId($_POST['id'])) {
                        $result['exception'] = 'Tarea inexistente';
                    } elseif (!$tareas->obtenerTarea()) {
                        $result['exception'] = 'Tarea inexistente';
                    } elseif ($tareas->modificarTarea()) {
                        if ($result['dataset'] = $tareas->obtenerTarea()) {
                            $result['status'] = 1;
                            $result['message'] = 'Asignación modificada, si lo desea asigne empleados';
                        } else {
                            $result['exception'] = '¡Lo sentimos! La tarea se perdió entre las demás, inténtalo de nuevo';
                        }
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = '¡Lo sentimos! No se pudo crear la tarea';
                    }
                } else {
                    $result['exception'] = '¿Que haces?, no deberías hacer esto';
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

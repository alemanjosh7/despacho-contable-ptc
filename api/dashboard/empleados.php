<?php
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../models/empleados.php');
require_once('../models/rec.php');
require_once('../libraries/googleAUTH/PHPGangsta/googleAUTHC.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    
    //Función para retornar el correo censurado

    function formatEmail($correo) 
    {
        //Se recorta las primeras 3 líneas del correo
        $comienzo = substr($correo, 0, strlen($correo) - (strlen($correo) - 3));
        //Se extraen el dominio del correo
        $final = substr($correo, strripos($correo, '@') - strlen($correo));
        //Se obtiene el sobrante del correo para saber su longitud
        $restante = substr($correo, (strlen($correo) - (strlen($correo) - 3)), (strripos($correo, '@') - strlen($correo)));
        //Se le agregan asteríscos según la longitud del correo restante
        $total = str_pad($comienzo, strlen($restante), "*", STR_PAD_RIGHT);
        //Se une el todo para generar el nuevo formato de correo
        return $total.$final;
    }
    
    // Se instancia la clase correspondiente.
    $empleados = new Empleados;
    $gAuth = new Autentificador;
    $rec = new Rec;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null, 'cambioCtr' => null, 'correo' => null,'gQAuth' => null );
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])  && $_SESSION['verifyP2']) {
        $result['session'] = 1;
        $result['cambioCtr'] = $_SESSION['cambioCtr'];
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
                //Log Out
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
                //Nombre apellido del empleado
            case 'nombreApellido':
                if ($result['dataset'] = $admins->nombreApellidoEmpleado()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo obtener la información necesaria para el saludo';
                }
                break;
                //Obtener el tipo de empleado
            case 'obtenerTipoEmpleado':
                if ($result['dataset'] = $empleados->obtenerTipoEmpleado()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                //Obtener todos los empleados con limite
            case 'readAllLimit':
                if ($result['dataset'] = $empleados->buscarEmpleadosLimite($_POST['limit'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay empleados registrados';
                }
                break;
                //Actualizar contraseñas uno es para cuando hay session y otro para obligar a cambiar la contraseña EN ESE ORDEN
            case 'actualizarContraL':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->setId($_SESSION['id_usuario'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$empleados->checkContrasenaEmpleado2($_POST['contrasena_actual'])) {
                    $result['exception'] = 'Clave actual incorrecta';
                    $result['message'] = $_POST['contrasena_actual'];
                } elseif ($empleados->checkContrasenaEmpleado2($_POST['contrasena_confirma'])) {
                    $result['exception'] = 'La contraseña nueva no debe ser igual a la anterior';
                } elseif ($_POST['contrasena_nueva'] != $_POST['contrasena_confirma']) {
                    $result['exception'] = 'Claves nuevas diferentes';
                } elseif (!$empleados->setContrasena($_POST['contrasena_nueva'])) {
                    $result['exception'] = $empleados->getPasswordError();
                } elseif ($empleados->verificarContraDat(null, $_POST['contrasena_nueva'], false)) {
                    $result['exception'] = 'La contraseña no debe ser igual a algun dato del empleado';
                } elseif ($empleados->cambiarContrasenaEmpleado()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                    $empleados->verificarCambioCtr();
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'actualizarContra':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->checkUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Usuario inexistente';
                } elseif (!$empleados->setContrasena($_POST['contrasena'])) {
                    $result['exception'] = $empleados->getPasswordError();
                } elseif ($empleados->checkContrasenaEmpleado2($_POST['contrasena'])) {
                    $result['exception'] = 'La contraseña nueva no puede ser igual a la actual';
                } elseif ($empleados->verificarContraDat(null, $_POST['contrasena'], false)) {
                    $result['exception'] = 'La contraseña no debe ser igual a algun dato del empleado';
                } elseif ($empleados->cambiarContrasenaEmpleado()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                    $empleados->verificarCambioCtr();
                } else {
                    $result['exception'] = 'La contraseña no se pudo actualizar';
                }
                break;
                //Leer el perfil
            case 'readProfile':
                if ($result['dataset'] = $empleados->obtenerPerfilEmpleado()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Usuario inexistente';
                }
                break;
                //Buscar empleados
            case 'search':
                $_POST = $empleados->validateForm($_POST);
                if ($_POST['input-file'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $empleados->buscarEmpleadosLimit2($_POST['input-file'], $_POST['limit'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
                //Crear empleado
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
                } elseif ($_POST['contra-emp'] != $_POST['contrac-emp']) {
                    $result['exception'] = 'Claves diferentes';
                } elseif (!$empleados->setContrasena($_POST['contra-emp'])) {
                    $result['exception'] = $empleados->getPasswordError();
                    $result['message'] = $_POST['nombre-emp'];
                } elseif ($empleados->verificarContraDat($_POST, $_POST['contra-emp'], true)) {
                    $result['exception'] = 'La contraseña no debe ser igual a algun dato del empleado';
                } elseif (!isset($_POST['tipo-de-empleado'])) {
                    $result['exception'] = 'Seleccione un tipo de empleado';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setTipoEmpleado($_POST['tipo-de-empleado'])) {
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
                    $result['message'] = 'Empleado creado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo crear el empleado';
                }
                break;
                //Actualizar empleado
            case 'update':
                $_POST = $empleados->validateForm($_POST);
                if ($_SESSION['id_usuario'] != 1 && $_POST['id'] == 1) {
                    $result['exception'] = 'No puedes modificar al jefe';
                } elseif (!$empleados->setId($_POST['id'])) {
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
                    $result['exception'] = 'Nombre de usuario invalido';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif ($_POST['contra-emp'] != $_POST['contrac-emp']) {
                    $result['exception'] = 'Claves diferentes';
                } else if (!$data = $empleados->obtenerContra($_POST['id'])) {
                    $result['exception'] = 'Contra inexistente';
                } elseif ($_POST['contra-emp'] == '') {
                    if (!isset($_POST['tipo-de-empleado'])) {
                        $result['exception'] = 'Seleccione un tipo de empleado';
                        $result['message'] = $_POST['nombre-emp'];
                    } elseif (!$empleados->setTipoEmpleado($_POST['tipo-de-empleado'])) {
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
                    } elseif (!$empleados->setEstado(isset($_POST['estado']) ? 4 : 5)) {
                        $result['exception'] = 'Estado de empleado invalido';
                    } elseif ($empleados->actualizarEmpleado()) {
                        $result['status'] = 1;
                        $result['message'] = 'Empleado modificado excepto la contraseña';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se pudo actualizar el empleado';
                    }
                } elseif (($_POST['contra-emp'] != '' && !$empleados->setContrasena($_POST['contra-emp']))) {
                    $result['exception'] = $empleados->getPasswordError();
                } elseif ($empleados->verificarContraDat($_POST, $_POST['contra-emp'], true)) {
                    $result['exception'] = 'La contraseña no debe ser igual a algun dato del empleado';
                } elseif (!isset($_POST['tipo-de-empleado'])) {
                    $result['exception'] = 'Seleccione un tipo de empleado';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setTipoEmpleado($_POST['tipo-de-empleado'])) {
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
                } elseif (!$empleados->setEstado(isset($_POST['estado']) ? 4 : 5)) {
                    $result['exception'] = 'Estado de empleado invalido';
                } elseif ($empleados->actualizarEmpleado()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado modificado con contraseña';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo actualizar el empleado';
                }
                break;
                //Obtener empleado
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
                //Eliminar empleado
            case 'delete':
                if ($_SESSION['id_usuario'] != 1 && $_POST['id'] == 1) {
                    $result['exception'] = 'No puedes eliminar al jefe';
                } elseif ($_POST['id'] == $_SESSION['id_usuario']) {
                    $result['exception'] = 'No se puede eliminar a si mismo';
                } elseif (!$empleados->setId($_POST['id'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$data = $empleados->obtenerEmpleado($_POST['id'])) {
                    $result['exception'] = 'Empleado inexistente';
                } elseif ($empleados->eliminarEmpleado($_POST['id'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado eliminado correctamente';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo eliminar el empleado';
                }
                break;
                //Actualizar el perfil
            case 'updateProf':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->setId($_SESSION['id_usuario'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$data = $empleados->obtenerEmpleado($_SESSION['id_usuario'])) {
                    $result['exception'] = 'Empleado inexistente';
                } elseif (!$empleados->setNombre($_POST['nombre'])) {
                    $result['exception'] = 'Nombre invalido';
                } elseif (!$empleados->setUsuario($_POST['Username'])) {
                    $result['exception'] = 'Usuario invalido';
                } elseif (!$empleados->setApellido($_POST['apellido'])) {
                    $result['exception'] = 'Apellido invalido';
                } elseif (!$empleados->setCorreo($_POST['correo'])) {
                    $result['exception'] = 'Correo invalido';
                } elseif (!$empleados->setDUI($_POST['dui'])) {
                    $result['exception'] = 'Dui invalido';
                } elseif (!$empleados->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'Telefono invalido';
                } elseif ($empleados->actualizarPerfil()) {
                    $result['status'] = 1;
                    $result['message'] = 'Actualización de perfil correcta';
                    $_SESSION['usuario'] = $empleados->getUsuario();
                    $empleados->nombreApellidoEmpleado();
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo eliminar el empleado';
                }
                break;
                //Obtener la cantidad de empleados de cada tipo de empleado
            case 'cantidadTpEmp':
                if ($result['dataset'] = $empleados->graficaCantidadTpEm()) {
                    $result['status'] = 1;
                } else {
                    $result['exception'] = 'No hay datos disponibles';
                }
                break;

                //Obtener la cantidad de folders de cada empresa
            case 'graficaEmpAcc':
                $_POST = $empleados->validateForm($_POST);
                if ($_POST['rangoi'] == '' || $_POST['rangof'] == '') {
                    $result['exception'] = 'No se permiten campos vacios';
                } elseif (!is_numeric($_POST['rangoi']) && !is_numeric($_POST['rangof'])) {
                    $result['exception'] = 'Verifique que los datos sean números';
                } elseif (!($_POST['rangoi'] < $_POST['rangof'])) {
                    $result['exception'] = 'El rango final debe ser mayor al rango inicial';
                } elseif ($result['dataset'] = $empleados->graficaEmpAcc($_POST['rangoi'], $_POST['rangof'])) {
                    $result['status'] = 1;
                } else {
                    $result['exception'] = 'No hay datos disponibles';
                }
                break;
                //Obtener la verificación si la fecha es mayor a la actual
            case 'verificarFechaCtr':
                if ($empleados->verificarCambioCtr()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe cambiar su contraseña por seguridad cada 90 días, ese periodo ya paso ¡Cambiela!';
                } else {
                    $resul['exception'] = 'No es obligatorio cambiar la contraseña';
                }
                break;
                //Obetener los empleados para comprobar el primer uso
            case 'checkPUsuario':
                if ($result['dataset'] = $empleados->buscarEmpleadosLimite(0)) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay empleados registrados';
                }
                break;
                //Generamos codigo QR
            case 'generarQRGAUTH':
                $_POST = $empleados->validateForm($_POST);
                if(!$empleados->setId($_SESSION['id_usuario'])){
                    $result['exception'] = 'No pudo reconocerse el usuario logueado';
                }elseif(!$empleados->checkContrasenaEmpleado2($_POST['contrasena'])){
                    $result['exception'] = 'La contraseña no coincide con la del usuario';
                }elseif($empleados->cheackGAUTH()){
                    $result['exception'] = 'Ya posee un codigo de autenticación, eliminelo para poder generar otro';
                }elseif($result['dataset'] =  $gAuth->generarSecreto($_SESSION['usuario'])){
                    if($empleados->setearGAUTH(true,$result['dataset'][0])){
                        $result['status'] = 1;
                    }elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    }
                }else{
                    $result['exception'] = 'No se pudo generar generar el codigo de Google Authenticator';
                    $empleados->setearGAUTH(false);
                }
                break;
                //Eliminamos el codigo QR
            case 'quitarQRAUTH':
                $_POST = $empleados->validateForm($_POST);
                if(!$empleados->setId($_SESSION['id_usuario'])){
                    $result['exception'] = 'No pudo reconocerse el usuario logueado';
                } elseif(!$empleados->cheackGAUTH()){
                    $result['exception'] = 'No posee un codigo de autenticación, genere uno si lo desea';
                } elseif(!$gAuth->verificarCodigo($empleados->cheackGAUTH(),$_POST['codigo'])){
                    $result['exception'] = 'El codigo no coincide con el de la aplicación';
                }elseif($empleados->setearGAUTH(false)){
                    $result['status'] = 1;
                    $result['message'] = 'Se logro eliminar el codigo QR de eliminar';
                }elseif(Database::getException()) {
                    $result['exception'] = Database::getException();
                }
                break;
                //Eliminar el codigo QR de un empleado
            case 'eliminarQRAUTH':
                $_POST = $empleados->validateForm($_POST);
                if ($_SESSION['id_usuario'] != 1 && $_POST['id'] == 1) {
                    $result['exception'] = 'No puedes modificar al jefe';
                } elseif($_SESSION['id_usuario'] != 1){
                    $result['exception'] = 'Solo el jefe puede eliminar el tripe factor de un empleado';
                } elseif(!$empleados->setId($_POST['id'])){
                    $result['exception'] = 'No pudo reconocerse el usuario logueado';
                } elseif(!$empleados->cheackGAUTH()){
                    $result['exception'] = 'No posee un codigo de autenticación con google authenticator';
                } elseif($empleados->setearGAUTH(false)){
                    $result['status'] = 1;
                    $result['message'] = 'Se logro eliminar el codigo QR de eliminar';
                } elseif(Database::getException()) {
                    $result['exception'] = Database::getException();
                }

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
                    $result['exception'] = 'Usuario o contraseña incorrecto';
                } elseif (!$empleados->checkEmpleadosActivos()) {
                    $result['exception'] = 'Nombre de usuario eliminado o bloqueado, comunicate con tu administrador';
                } elseif (!$empleados->checkIntentosEmpleado()) {
                    $result['exception'] = 'Ha ingresado mal la contraseña 3 veces con anterioridad, por ende su cuenta se ha bloqueado. Busque un administrador para desbloquearla';
                } elseif ($empleados->checkContrasenaEmpleado($_POST['contrasena'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                    $_SESSION['id_usuario'] = $empleados->getId();
                    $_SESSION['usuario'] = $empleados->getUsuario();
                    $_SESSION['saludoI'] = false;
                    $empleados->nombreApellidoEmpleado();
                    $empleados->tipoEmpleado();
                    $empleados->verificarCambioCtr();
                } else {
                    $result['exception'] = 'Usuario o contraseña incorrecto';
                }
                break;
                //Actualizar la contraseña
            case 'actualizarContra':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->checkUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Usuario inexistente';
                } elseif (!$empleados->setContrasena($_POST['contrasena'])) {
                    $result['exception'] = $empleados->getPasswordError();
                } elseif ($empleados->verificarContraDat(null, $_POST['contrasena'], false)) {
                    $result['exception'] = 'La contraseña no debe ser igual a algun dato del empleado';
                } elseif ($empleados->cambiarContrasenaEmpleado()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['exception'] = 'La contraseña no se pudo actualizar';
                }
                break;
                //Obetener los empleados para comprobar el primer uso
            case 'checkPUsuario':
                if ($result['dataset'] = $empleados->buscarEmpleadosLimite(0)) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay empleados registrados';
                }
                break;
                //Crear al primer administrador y por lo tanto el jefe
            case 'crearPrimerUsuario':
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
                } elseif ($_POST['contra-emp'] != $_POST['contrac-emp']) {
                    $result['exception'] = 'Claves diferentes';
                } elseif (!$empleados->setContrasena($_POST['contra-emp'])) {
                    $result['exception'] = $empleados->getPasswordError();
                    $result['message'] = $_POST['nombre-emp'];
                } elseif ($empleados->verificarContraDat($_POST, $_POST['contra-emp'], true)) {
                    $result['exception'] = 'La contraseña no debe ser igual a algun dato del empleado';
                } elseif (!$empleados->setDUI($_POST['dui-emp'])) {
                    $result['exception'] = 'DUI incorrecto';
                    $result['message'] = $_POST['nombre-emp'];
                } elseif (!$empleados->setTelefono($_POST['telefono-emp'])) {
                    $result['exception'] = 'Teléfono incorrecto';
                    $result['message'] = $_POST['telefono-emp'];
                } elseif (!$empleados->setCorreo($_POST['correo-emp'])) {
                    $result['exception'] = 'Correo incorrecto';
                } elseif (!$rec->setCodigo($_POST['pinRecP'])) {
                    $result['exception'] = $rec->getPasswordError();
                } elseif ($empleados->primerUsuario()) {
                    if ($rec->crearCodigoRec()) {
                        $result['status'] = 1;
                        $result['message'] = 'Jefe creado con exito ¡Bienvenido a Smart Bookkeeping!';
                    } else {
                        $empleados->rte();
                        $result['exception'] = 'Hubo un error al crear al jefe';
                    }
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo crear el empleado';
                }
                break;
            //Obtener el correo del empleado
            case 'obtenerCorreoEmp':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->checkUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Usuario o contraseña incorrecto';
                } elseif (!$empleados->checkEmpleadosActivos()) {
                    $result['exception'] = 'Nombre de usuario eliminado o bloqueado, comunicate con tu administrador';
                } elseif (!$empleados->checkIntentosEmpleado()) {
                    $result['exception'] = 'Ha ingresado mal la contraseña 3 veces con anterioridad, por ende su cuenta se ha bloqueado. Busque un administrador para desbloquearla';
                } elseif (!$empleados->checkContrasenaEmpleado($_POST['contrasena'])) {
                    $result['exception'] = 'Usuario o contraseña incorrecto';
                } elseif ($result['dataset'] = $empleados->obtenerEmpleado($empleados->getId())) {
                    $result['status'] = 1;
                    $result['correoF'] = formatEmail($result['dataset']['correo_empleadocontc']);
                    $result['correo'] = $result['dataset']['correo_empleadocontc'];
                }elseif(Database::getException()){
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Hubo un error al obtener el correo del empleado';
                }
                break;
                //Comprobar si hay un codigo de google Authenticator vinculado a la cuenta
            case 'checkCodigoGAuth':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->checkUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Usuario o contraseña incorrecto';
                } elseif (!$empleados->checkEmpleadosActivos()) {
                    $result['exception'] = 'Nombre de usuario eliminado o bloqueado, comunicate con tu administrador';
                } elseif (!$empleados->checkIntentosEmpleado()) {
                    $result['exception'] = 'Ha ingresado mal la contraseña 3 veces con anterioridad, por ende su cuenta se ha bloqueado. Busque un administrador para desbloquearla';
                } elseif(!$empleados->cheackGAUTH()){
                    $result['dataset'] = false;
                }else{
                    $result['dataset'] = true;
                }
                break;
                //Comprobar que el codigo de verificación enviado sea el correcto
            case 'verificarCGA':
                $_POST = $empleados->validateForm($_POST);
                if (!$empleados->checkUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Usuario o contraseña incorrecto';
                } elseif (!$empleados->checkEmpleadosActivos()) {
                    $result['exception'] = 'Nombre de usuario eliminado o bloqueado, comunicate con tu administrador';
                } elseif (!$empleados->checkIntentosEmpleado()) {
                    $result['exception'] = 'Ha ingresado mal la contraseña 3 veces con anterioridad, por ende su cuenta se ha bloqueado. Busque un administrador para desbloquearla';
                } if($gAuth->verificarCodigo($empleados->cheackGAUTH(),$_POST['codigo'])){
                    $result['status'] = 1;
                    $result['message'] = 'El codigo coincide con el de la aplicación';
                }else{
                    $result['exception'] = 'El codigo no coincide con el de la aplicación';
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

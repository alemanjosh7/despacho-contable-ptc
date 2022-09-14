 <?php
    /*Esta carpeta indicará las variables globales de sesion y tendrá algunos metodos para obtenerlos, por el momento solo los definiremos
id_usuario = El id del usuario que inicio session 
usuario = EL nombre del usuario 
nombreUsuario = Nombrel de la persona con el id_usuario
apellidoUsuario = Apellido de la persona con el id_usuario
tipo_usuario = El tipo de usuario que ha iniciado sessión
id_empresa = El id de la empresa seleccionada
id_folder = El id de la empresa seleccionada
saludoI = Variable para el saludo tras iniciar session
cambioCtr = Variable que indica si es necesario cambiar la contraseña, por defecto es false a menos que sea necesario cambiarla
verifyP2 = Variable que verifica si paso el método P2
*/
    require_once('helpers/database.php');
    require_once('helpers/validator.php');
    require_once('models/rec.php');
    // Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_GET['action'])) {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
        session_start();
        // Se instancia la clase correspondiente.
        $rec = new Rec;
        /*$_SESSION['id_usuario'] = 1;
        $_SESSION['usuario'] = 'Salvador245';
        $_SESSION['saludoI'] = false;
        $_SESSION['tipo_usuario'] = 4;
        $_SESSION['nombreUsuario'] = 'Jesus';
        $_SESSION['apellidoUsuario'] = 'Apellido';*/
        $_SESSION['verifyP2'] = true;
        // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
        $result = array(
            'status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'idusuario' => null, 'usuario' => null,
            'nombre' => null, 'apellido' => null, 'id_empresa' => null, 'id_folder' => null, 'tipo_usuario' => null, 'cambioCtr' => null
        );

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
            return $total . $final;
        }

        //Función para generar un PIN alfanumerico
        function generarPINR($length = 25)
        {
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $charactersLength = strlen($characters);
            $randomString = '';
            for ($i = 0; $i < $length; $i++) $randomString .= $characters[rand(0, $charactersLength - 1)];
            return $randomString; //usage $myRandomString=generateRandomString(5);
        }

        //Se verifica que el estado del empleado siga estando activo
        if(isset($_SESSION['id_usuario'])){
            if (!$rec->checkEmpleadosActivos($_SESSION['id_usuario'])) {
                session_destroy();
            }
        }

        switch ($_GET['action']) {
            case 'getIdUsuario':
                if (isset($_SESSION['id_usuario'])) {
                    $result['status'] = 1;
                    $result['idusuario'] = $_SESSION['id_usuario'];
                } else {
                    $result['exception'] = 'No hay un id de usuairo';
                }
                break;
            case 'setIdUsuario':
                $result['status'] = 1;
                $_SESSION['id_usuario'] = $_POST['id'];
                break;
            case 'setNombreUsuario':
                $result['status'] = 1;
                $_SESSION['nombreUsuario'] = $_POST['nombre'];
                break;
            case 'setApellidoUsuario':
                $result['status'] = 1;
                $_SESSION['apellidoUsuario'] = $_POST['apellido'];
                break;
            case 'comprobarPINLog':
                $var = $_POST['pin'];
                if ($pin = $rec->obtenerCodigoRec()) {
                    if (password_verify($var, $pin)) {
                        $result['status'] = 1;
                        $result['message'] = 'PIN correcto';
                    } else {
                        $result['exception'] = 'PIN incorrecto solicite ayuda del administrador en jefe';
                    }
                } else {
                    $result['exception'] = 'No se pudo obtener el pin de la base de datos';
                }
                break;
            case 'getNombreApellido':
                $result['status'] = 1;
                $result['nombre'] = $_SESSION['nombreUsuario'];
                $result['apellido'] = $_SESSION['apellidoUsuario'];
                break;
                //Caso para verificar el saludo al pasar el login 
            case 'verificarSaludoI':
                //Si el saludo no es true
                if ($_SESSION['saludoI'] != true) {
                    //Se envia una comprobación que no es verdadero y se envia el nombre y el apellido del usuario
                    //Adicionalmente se cambia su valor a true
                    $result['status'] = 1;
                    $result['nombre'] = $_SESSION['nombreUsuario'];
                    $result['apellido'] = $_SESSION['apellidoUsuario'];
                    $_SESSION['saludoI'] = true;
                } else {
                    //Como no es verdadero, solo se envia el nombre y el apellido del usuario
                    $result['nombre'] = $_SESSION['nombreUsuario'];
                    $result['apellido'] = $_SESSION['apellidoUsuario'];
                }
                break;
                //Verificar si el usuario iniciado session es un administrador
            case 'verificarAdmin':
                //Comprobamos que su tipo sea administrador
                if (isset($_SESSION['id_usuario'])) {
                    $result['session'] = 1;
                    if (isset($_SESSION['id_usuario']) && $_SESSION['cambioCtr'] == true) {
                        $result['cambioCtr'] = 'Necesita cambiar la contraseña';
                    } elseif ($_SESSION['tipo_usuario'] == 4) {
                        $result['status'] = 1;
                        $result['tipo_usuario'] = $_SESSION['tipo_usuario'];
                    } else {
                        //Si no es administrador delvolvemos el id igualmente
                        $result['tipo_usuario'] = $_SESSION['tipo_usuario'];
                    }
                    $result['usuario'] = $_SESSION['usuario'];
                } else {
                    //Si no lo esta se envia un error
                    $result['exception'] = 'No se ha iniciado session';
                }
                break;
                //Cerrar la session   
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
                //Setear el id de la empresa
            case 'setIdEmpresa':
                $result['status'] = 1;
                $_SESSION['id_empresa'] = $_POST['id'];
                $result['id_empresa'] = $_SESSION['id_empresa'];
                break;
                //Setear el id del folder
            case 'setIdFolder':
                $result['status'] = 1;
                $_SESSION['id_folder'] = $_POST['id'];
                $result['id_folder'] = $_SESSION['id_folder'];
                break;
                //Verificar si se ha seteado el id de la empresa
            case 'getIdEmpresa':
                if (isset($_SESSION['id_empresa'])) {
                    $result['status'] = 1;
                    $result['id_empresa'] = $_SESSION['id_empresa'];
                } else {
                    $result['exception'] = 'No se ha seleccionado una empresa, seleccione una en el menu de empresas';
                }
                break;
                //Verificar si se ha seteado el id de la empresa
            case 'getIdFolder':
                if (isset($_SESSION['id_folder'])) {
                    $result['status'] = 1;
                    $result['id_folder'] = $_SESSION['id_folder'];
                } else {
                    $result['exception'] = 'No se ha seleccionado una empresa, seleccione una en el menu de empresas';
                }
                break;
                //Cambiar el codigo de recuperación
            case 'actualizarCodigoR':
                $_POST = $rec->validateForm($_POST);
                if ($_SESSION['id_usuario'] != 1) {
                    $result['exception'] = 'Solo el jefe puede cambiar el codigo de recuperación';
                } elseif (!$rec->checkAntgCr($_POST['pin'])) {
                    $result['exception'] = 'El codigo de recuperación actual no coincide con el registrado, si eres el jefe solicitalo';
                } elseif (!$rec->setCodigo($_POST['codigo'])) {
                    $result['exception'] = $rec->getPasswordError();
                } elseif ($rec->actualizarCodigoRec()) {
                    $result['status'] = 1;
                    $result['message'] = 'Codigo de recuperación de contraseñas cambiado';
                } else {
                    $result['exception'] = 'El codigo de recuperación de contraseñas no se pudo cambiar';
                }
                break;
                //Colocar un pin a la contraseña
            case 'setPINCTRR':
                if ($_SESSION['PIN'] = strval(generarPINR(4))) {
                    $result['status'] = 1;
                    $result['pinr'] = $_SESSION['PIN'];
                    $_SESSION['horaPIN'] = $_POST['hora'];
                } else {
                    $result['exception'] = 'El pin no se establecio';
                }
                break;
                //Obtener correo jefe
            case 'getCorreoJ':
                if ($_SESSION['id_usuario'] != 1) {
                    $result['exception'] = 'Solo el jefe puede cambiar el codigo de recuperación';
                } elseif ($result['dataset'] = $rec->obtenerCorreoJ()) {
                    $result['status'] = 1;
                    $result['message'] = 'Correo encontrado';
                    $result['correoF'] = formatEmail($result['dataset']['correo_empleadocontc']);
                } else {
                    $result['exception'] = 'El codigo de recuperación de contraseñas no se pudo cambiar';
                }
                break;
                //Obtener el PIN para restablecer la contraseña
            case 'comprobarPINRCR':
                $var = $_POST['pin'];
                $pin = $_SESSION['PIN'];
                if ($var == $pin) {
                    $_SESSION['verifyP2'] = true;
                    $result['hora'] = $_SESSION['horaPIN'];
                    $result['status'] = 1;
                } else {
                    $_SESSION['verifyP2'] = false;
                    $result['exception'] = 'El pin no coincide';
                }
                break;
                //Actualizar codigo de recuperar contraseña mediante el pin
            case 'actualizarCodigoRP':
                $_POST = $rec->validateForm($_POST);
                if ($_SESSION['id_usuario'] != 1) {
                    $result['exception'] = 'Solo el jefe puede cambiar el codigo de recuperación';
                } elseif (!$rec->setCodigo($_POST['codigo'])) {
                    $result['exception'] = $rec->getPasswordError();
                } elseif ($rec->actualizarCodigoRec()) {
                    $result['status'] = 1;
                    $result['message'] = 'Codigo de recuperación de contraseñas cambiado';
                } else {
                    $result['exception'] = 'El codigo de recuperación de contraseñas no se pudo cambiar';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Recurso no disponible'));
    }
    ?>
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
*/
    require_once('helpers/database.php');

    // Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_GET['action'])) {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
        session_start();
        /*$_SESSION['id_usuario'] = 1;
        $_SESSION['usuario'] = 'Salvador245';
        $_SESSION['tipo_usuario'] = 4;*/
        // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
        $result = array(
            'status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'idusuario' => null, 'usuario' => null,
            'nombre' => null, 'apellido' => null, 'id_empresa' => null, 'id_folder' => null, 'tipo_usuario' => null
        );
        switch ($_GET['action']) {
            case 'getIdUsuario':
                $result['status'] = 1;
                $result['idusuario'] = $_SESSION['id_usuario'];
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
                $pin = 'Root1L';
                if ($var == $pin) {
                    $result['status'] = 1;
                    $result['message'] = 'PIN correcto';
                } else {
                    $result['exception'] = 'PIN incorrecto solicite ayuda del administrador en jefe';
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
                    if ($_SESSION['tipo_usuario'] == 4) {
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
                }else{
                    $result['exception'] = 'No se ha seleccionado una empresa, seleccione una en el menu de empresas';
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
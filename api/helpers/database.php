<?php
/*
*   Clase para realizar las operaciones en la base de datos.
*/
class Database
{
    // Propiedades de la clase para manejar las acciones respectivas.
    private static $connection = null;
    private static $statement = null;
    private static $error = null;

    /*
    *   Método para establecer la conexión con el servidor de base de datos.
    */
    private static function connect()
    {
        // Credenciales para establecer la conexión con la base de datos.
        $server = 'ec2-3-93-206-109.compute-1.amazonaws.com';
        $database = 'dcrrufqfql2ack';
        $username = 'brpmvdiltvokld';
        $password = '8210bf8d04a72fe4d10b1f2ff54c7df41a17fad24dfe475e4febe94ac065eaa6';

        // Se crea la conexión mediante la extensión PDO y el controlador para PostgreSQL.
        self::$connection = new PDO('pgsql:host=' . $server . ';dbname=' . $database . ';port=5432', $username, $password);
    }

    /*
    *   Método para ejecutar las siguientes sentencias SQL: insert, update y delete.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: booleano (true si la sentencia se ejecuta satisfactoriamente o false en caso contrario).
    */
    public static function executeRow($query, $values)
    {
        try {
            self::connect();
            self::$statement = self::$connection->prepare($query);
            $state = self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return $state;
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            return false;
        }
    }

    /*
    *   Método para obtener el valor de la llave primaria del último registro insertado.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: numérico entero (último valor de la llave primaria si la sentencia se ejecuta satisfactoriamente o 0 en caso contrario).
    */
    public static function getLastRow($query, $values)
    {
        try {
            self::connect();
            self::$statement = self::$connection->prepare($query);
            if (self::$statement->execute($values)) {
                $id = self::$connection->lastInsertId();
            } else {
                $id = 0;
            }
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return $id;
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            return 0;
        }
    }

    /*
    *   Método para obtener un registro de una sentencia SQL tipo SELECT.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: arreglo asociativo del registro si la sentencia SQL se ejecuta satisfactoriamente o false en caso contrario.
    */
    public static function getRow($query, $values)
    {
        try {
            self::connect();
            self::$statement = self::$connection->prepare($query);
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return self::$statement->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }

    /*
    *   Método para obtener todos los registros de una sentencia SQL tipo SELECT.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *
    *   Retorno: arreglo asociativo de los registros si la sentencia SQL se ejecuta satisfactoriamente o false en caso contrario.
    */
    public static function getRows($query, $values)
    {
        try {
            self::connect();
            self::$statement = self::$connection->prepare($query);
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return self::$statement->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }

    /*
    *   Método para establecer un mensaje de error personalizado al ocurrir una excepción.
    *
    *   Parámetros: $code (código del error) y $message (mensaje original del error).
    *
    *   Retorno: ninguno.
    */
    private static function setException($code, $message)
    {
        // Se asigna el mensaje del error original por si se necesita.
        self::$error = utf8_encode($message);
        // Se compara el código del error para establecer un error personalizado.
        switch ($code) {
            case '7':
                self::$error = 'Existe un problema al conectar con el servidor';
                break;
            case '42703':
                self::$error = 'Nombre de campo desconocido';
                //self::$error = $message;
                break;
            case '23505':
                //self::$error = 'Dato duplicado, no se puede guardar';
                self::$error = $message;
                break;
            case '42P01':
                self::$error = 'Nombre de tabla desconocido';
                break;
            case '23503':
                self::$error = 'Registro ocupado, no se puede eliminar';
                //self::$error = $message;
                break;
            case '23502':
                self::$error = 'No se permite el registro de un dato nulo, verifique que todos los campos se llenen';
                break;
            case '42883':
                self::$error = 'Columna desconocida en la base de datos, comuniquese con soporte';
                break;
            case '42P02':
                self::$error = 'Parametro desconocido en la base de datos, comuniquese con soporte';
                break;
            case '42701':
                self::$error = 'Columna duplicada en la base de datos, comuniquese con soporte';
                break;
            case '42P04':
                self::$error = 'Base de datos duplicada, comuniquese con soporte inmediatamente';
                break;
            case '53000':
                self::$error = 'Recursos insuficientes, añada más almacenamiento';
                break;
            case '53100':
                self::$error = 'Recursos insuficientes, añada más almacenamiento';
                break;
            case '23505':
                self::$error = 'Campo duplicado, verifique no halla un campo usado actualmente';
            default:
                self::$error = 'Ocurrio un error en la base de datos';
                //self::$error = $message;
        }
    }

    /*
    *   Método para obtener un error personalizado cuando ocurre una excepción.
    *
    *   Parámetros: ninguno.
    *
    *   Retorno: error personalizado de la sentencia SQL o de la conexión con el servidor de base de datos.
    */
    public static function getException()
    {
        return self::$error;
    }
}

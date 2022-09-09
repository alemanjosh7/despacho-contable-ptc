<?php
/*
*   Clase para manejar la tabla empresas de la base de datos.
*   Es clase hija de Validator.
*/

class Rec extends Validator
{
    // Declaración de atributos (propiedades).
    private const id_codigorec = 1;
    private $codigorec = null;
    private const fk_id_empleado = 1;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */

    //Id
    public function setid($id)
    {   if($this->validateNaturalNumber($id)){
            $this->id_codigorec = $id;
            return true;
        } else{
            return false;
        }
    }

    //Codigo
    public function setCodigo($codigo)
    {   if($this->validatePinRec($codigo)){
            $this->codigorec = password_hash($codigo, PASSWORD_DEFAULT);
            return true;
        } else{
            return false;
        }
    }

    /*
        METODOS PARA CONSULTAS
    */

    //Crear un codigo de recuperación
    public function crearCodigoRec()
    {
        $sql = 'INSERT INTO tabla_codigo (id_codigorec,codigorec,fk_id_empleado) VALUES (1,?,1)';
        $params = array($this->codigorec);
        return Database::executeRow($sql, $params);
    }

    //Actualiza un codigo de recuperación
    public function actualizarCodigoRec()
    {
        $sql = 'UPDATE tabla_codigo SET codigorec = ? WHERE id_codigorec = 1';
        $params = array($this->codigorec);
        return Database::executeRow($sql, $params);
    }

    //Obtener el codigo de recuperación
    public function obtenerCodigoRec()
    {
        $sql = 'SELECT * FROM tabla_codigo WHERE id_codigorec = 1';
        $params = null;
        if ($data = Database::getRow($sql, $params)) {
            return $data['codigorec'];
        } else {
            return false;
        }
    }
    //Verificar que el codigo de recuperación antiguo sea el mismo del enviado
    public function checkAntgCr($codigoa){
        $sql = 'SELECT * FROM tabla_codigo WHERE id_codigorec = 1';
        $params = null;
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($codigoa, $data['codigorec'])) {
            return true;
        } else {
            return false;
        }
    }
    //Obtener el correo del jefe
    public function obtenerCorreoJ(){
        $sql = 'SELECT correo_empleadocontc from empleados WHERE id_empleado = 1';
        $params = null;
        return Database::getRow($sql, $params);
    }
}
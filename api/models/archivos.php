<?php
/*
*	Clase para manejar la tabla Valoraciones de la base de datos.
*   Es clase hija de Validator.
*/

class Archivos extends Validator
{
    // Declaración de atributos (propiedades).
    private $id_archivo = null;
    private $nombre_archivo = null;
    private $fecha_subida = null;
    private $fk_id_folder = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */

    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_archivo = $value;
            return true;
        } else {
            return false;
        }
    }

    
    public function setNombreArch($value)
    {
        if ($this->validateString($value, 1, 200)) {
            $this->nombre_archivo = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFecha($value)
    {
        if ($this->date($value)) {
            $this->fecha_subido = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdFolder($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->fk_id_folder = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getId()
    {
        return $this->id_archivo;
    }

    public function getNombreArch()
    {
        return $this->nombre_archivo;
    }

    public function getFecha()
    {
        return $this->fecha_subido;
    }

    public function getIdFolder()
    {
        return $this->fk_id_folder;
    }

    /*
    *   Metodos para consultas
    */
    //Función para consultar las empresas con limit
    public function obtenerArchivoLimit($limit)
    {
        $sql = 'SELECT id_archivo, nombre_archivo, fecha_subida, fk_id_folder
                FROM archivos
                WHERE fk_id_estado = 4 AND fk_id_folder = ? AND id_archivo NOT IN (SELECT id_archivo FROM archivos ORDER BY id_archivo DESC limit ?) ORDER BY id_archivo DESC limit 6';
        $params = array($this->fk_id_empresa,$limit);
        return Database::getRows($sql, $params);
    }
 
    //Buscar Archivo
    public function buscarArchivo($value)
    {
        $sql = 'SELECT id_archivo, nombre_archivo, fecha_subida, fk_id_folder, fk_id_estado
                FROM archivos 
                WHERE (nombre_archivo ILIKE ?) AND fk_id_estado = 4 AND fk_id_folder = ?';
        $params = array("%$value%",$this->fk_id_folder);
        return Database::getRows($sql, $params);
    }

    //Buscar Archivo por el folder
    public function obtenerFolder()
    {
        $sql = 'SELECT id_archivo, nombre_archivo, fecha_subida, fk_id_folder, fk_id_estado
                FROM archivos
                WHERE id_archivo=? AND fk_id_estado = 4 AND fk_id_folder = ?';
        $params = array($this->id_archivo,$this->fk_id_folder);
        return Database::getRow($sql, $params); 
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    //Crear Archivo.
    public function crearArchivo()
    {
        $sql = 'INSERT INTO archivos(nombre_archivo, fecha_subida, fk_id_folder)
                VALUES (?, ?, ?);';
        $params = array($this->nombre_archivo, $this->fecha_subibo, $this->fk_id_folder);
        return Database::executeRow($sql, $params);
    }

    //Actualizar Archivo
    public function actualizarArchivo()
    {
        $sql = 'UPDATE archivos
                SET nombre_archivo=?, fecha_subida=?, fk_id_folder=?
                WHERE id_archivo = ?';
        $params = array($this->nombre_archivo, $this->fecha_subibo, $this->fk_id_folder, $this->id_archivo);
        return Database::executeRow($sql, $params);
    }

     //Eliminar Archivo
     public function eliminarArchivo()
     {
         $sql = 'DELETE FROM archivos WHERE id_archivo = ?';
         $params = array($this->id_archivo);
         return Database::executeRow($sql, $params);
     }
}
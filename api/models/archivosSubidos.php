<?php
/*
*   Clase para manejar la tabla Valoraciones de la base de datos. 
*   Es clase hija de Validator.
*/

class archivosSubidos extends Validator

{
    //Declaracion de atributos

    private $id_archivos_subidosemp = null;
    private $nombre_archivo = null;
    private $fecha_subida = null;
    private $descripcion = null;
    private $fk_id_empleado = null;
    private $fk_id_empresa = null;
    private $fk_id_estado = null;
    private $tamano = null;
    private $nombre_original;
    private $ruta = '../documents/archivosEmpleados/';

    //Metodos para asignar valores y validar atributos

    public function setIdArchivo($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_archivos_subidosemp = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombreArchivo($file)
    {
        if ($this->validateFile($file)) {
            $this->nombre_archivo = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    public function setFechaSubida($value)
    {
        if ($this->date($value)) {
            $this->fecha_subida = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescripcion($value)
    {
        if ($this->validateString($value, 1, 150)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdEmpleado($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->fk_id_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdEmpresa($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->fk_id_empresa = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdEstado($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->fk_id_estado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTamano($value)
    {
        if ($this->validateString($value)) {
            $this->tamano = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombreOriginal($value)
    {
        if ($this->validateString($value, 1, 200)) {
            $this->nombre_original = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener valores de los atributos

    public function getIdArchivo()
    {
        return $this->id_archivos_subidosemp;
    }

    public function getNombreArchivo()
    {
        return $this->nombre_archivo;
    }

    public function getFechaSubida()
    {
        return $this->fecha_subida;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getIdEmpleado()
    {
        return $this->fk_id_empleado;
    }

    public function getIdEmpresa()
    {
        return $this->fk_id_empresa;
    }

    public function getIdEstado()
    {
        return $this->fk_id_estado;
    }

    public function getTamano()
    {
        return $this->tamano;
    }

    public function getNombreOriginal()
    {
        return $this->nombre_original;
    }

    public function getRuta()
    {
        return $this->ruta;
    }

    //Metodos SCRUD (Search, Create, Read, Update, Delete)
    public function searchArchivoSub()
    {
        $sql = 'SELECT id_archivos_subidosemp, nombre_archivo, fecha_subida, descripcion, "fk_id_empleado", "fk_id_empresa", tamano, nombre_original
                FROM archivos_subidosemp INNER JOIN empresas ON archivos_subidosemp."fk_id_empresa" = empresas.id_empresa
                WHERE nombre_archivo ILIKE ? OR nombre_empresa ILIKE ? 
                ORDER BY nombre_archivo';
        $params = array("%$value%", "%$value%");
        return Database::executeRow($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT id_archivos_subidosemp, nombre_archivo, descripcion, "fk_id_empleado", "fk_id_empresa", nombre_original
        FROM archivos_subidosemp WHERE id_archivos_subidosemp = ?';
        $params = array($this->id_archivos_subidosemp);
        return Database::getRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT sub.id_archivos_subidosemp, nombre_archivo, nombre_original, emp.nombre_empresa
                FROM archivos_subidosemp sub
                INNER JOIN empresas emp ON sub."fk_id_empresa" = emp.id_empresa 
                ORDER BY nombre_archivo';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readAllEmp()
    {
        $sql = 'SELECT id_empresa, nombre_empresa FROM empresas';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function insertarArchivoSub()
    {
        $sql = 'INSERT INTO archivos_subidosemp (nombre_archivo, descripcion, "fk_id_empleado", "fk_id_empresa", nombre_original)
        VALUES (?,?,?,?,?)';
        $params = array($this->nombre_archivo, $this->descripcion, $this->fk_id_empleado, $this->fk_id_empresa, $this->nombre_original);
        return Database::executeRow($sql, $params);
    }

    public function actualizarArchivoSub()
    {
        $sql = '';
        $params = array();
        return Database::executeRow($sql, $params);
    }

    public function eliminarArchivoSub()
    {
        $sql = 'DELETE FROM archivos_subidosemp WHERE id_archivos_subidosemp = ?';
        $params = array($this->id_archivos_subidosemp);
        return Database::executeRow($sql, $params);
    }
}
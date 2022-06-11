<?php
/*
*   Clase para manejar la tabla Valoraciones de la base de datos. 
*   Es clase hija de Validator.
*/

class archivos_subidosemp extends Validator

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

    //Metodos para asignar valores y validar atributos

    public function setIdArchSubidosEmp($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_archivos_subidosemp = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombreArchivo($value)
    {
        if ($this->validateFile($file)) {
            $this->nombre_archivo = $value;
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
        if ($this->validateString($value)) {
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
        if ($this->validateString($value)) {
            $this->nombre_original = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener valores de los atributos

    public function getIdArchSubidosEmp()
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

    //Metodos SCRUD (Search, Create, Read, Update, Delete)
    
}
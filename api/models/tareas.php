<?php
/*
*	Clase para manejar la Tareas Valoraciones de la base de datos.
*   Es clase hija de Validator.
*/

class Tareas extends Validator
{
    // Declaración de atributos (propiedades).
    private $id_tarea = null;
    private $observacion = null;
    private $asignacion = null;
    private $fecha_asignada = null;
    private $fecha_limite = null;
    private $apartado = null;
    private $fk_id_estado = null;
    private $fk_id_empresa = null;
    private $fk_id_folder = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */

    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_tarea = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setObservacion($value)
    {
        if ($this->validateString($value, 1, 200)) {
            $this->observacion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setAsignacion($value)
    {
        if ($this->validateString($value, 1, 250)) {
            $this->asignacion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFechaL($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_limite = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setApartado($value)
    {
        if ($this->validateNaturalNumber($value)) {
            if ($value > 5) {
                return false;
            } else {
                $this->apartado = $value;
                return true;
            }
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

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getId()
    {
        return $this->id_tarea;
    }

    public function getObservacion()
    {
        return $this->observacion;
    }

    public function getAsignacion()
    {
        return $this->asignacion;
    }

    public function getFechaASG()
    {
        return $this->fecha_asignada;
    }

    public function getFechaLMT()
    {
        return $this->fecha_limite;
    }

    public function getIdEstado()
    {
        return $this->fk_id_estado;
    }

    public function getApartado()
    {
        return $this->apartado;
    }

    public function getIdEmpresa()
    {
        return $this->fk_id_empresa;
    }

    public function getIdFolder()
    {
        return $this->fk_id_folder;
    }

    /*
    *   Métodos para consultas
    */
    //Función para consultar las tareas con limit
    public function obtenerTareasLimit($limit)
    {
        $sql = 'SELECT tra.id_tarea, tra.observacion, tra.asignacion, tra.fecha_asignada, tra.fecha_limite, tra.apartado, 
                est.nombre_estado , tra.fk_id_empresa, tra.fk_id_folder
                FROM tareas AS tra
                INNER JOIN estados AS est ON tra.fk_id_estado = est.id_estado
                ORDER BY tra.fecha_limite DESC OFFSET ? LIMIT 6';
        $params = array($limit);
        return Database::getRows($sql, $params);
    }
    //Función para consultar las tareas asignadas
    public function obtenerTareasAsignadas($limit)
    {
        $sql = 'SELECT tra.id_tarea, tra.observacion, tra.asignacion, tra.fecha_asignada, tra.fecha_limite, tra.apartado, 
            est.nombre_estado , 
            tra.fk_id_empresa, tra.fk_id_folder, tae.fk_id_empleado
            FROM tareas AS tra
            INNER JOIN estados AS est ON tra.fk_id_estado = est.id_estado
            INNER JOIN tareas_empleados AS tae ON tae.fk_id_tarea = tra.id_tarea
            WHERE tae.fk_id_empleado = ?
            ORDER BY tra.fecha_limite DESC OFFSET ? LIMIT 6';
        $params = array($_SESSION['id_usuario'], $limit);
        return Database::getRows($sql, $params);
    }

    //buscar tareas para el que no es admin
    public function buscarTareasCl($value, $limit)
    {
        $sql = 'SELECT tra.id_tarea, tra.observacion, tra.asignacion, tra.fecha_asignada, tra.fecha_limite, tra.apartado, 
                est.nombre_estado , 
                tra.fk_id_empresa, tra.fk_id_folder, tae.fk_id_empleado
                FROM tareas AS tra
                INNER JOIN estados AS est ON tra.fk_id_estado = est.id_estado
                INNER JOIN tareas_empleados AS tae ON tae.fk_id_tarea = tra.id_tarea
                WHERE (tae.fk_id_empleado = ?) AND 
                (tra.observacion ILIKE ?, tra.asignacion ILIKE ?, cast(tra.fecha_asignada as varchar) ILIKE ?,
                    cast(tra.fecha_limite as varchar) ILIKE ?)
                LIMIT ?';
        $params = array($_SESSION['id_usuario'],"%$value%", "%$value%", "%$value%", "%$value%", $limit);
        return Database::getRows($sql, $params);
    }
    //Función para comprobar la empresa de la tarea que aun exista
    public function checkEmpresa($id)
    {  
        $sql = 'SELECT id_empresa FROM empresas WHERE cast(id_empresa as varchar) = ?';
        $params = array($id);
        if(Database::getRow($sql, $params)) {
            return true;
        } else {
            return false;
        }
    }

    //Función para comprobar el folder de la tarea que aun exista
    public function checkFolder($id)
    {  
        $sql = 'SELECT id_folder FROM folders WHERE cast(id_folder as varchar) = ?';
        $params = array($id);
        if(Database::getRow($sql, $params)) {
            return true;
        } else {
            return false;
        }
    }
    //Obtener la ultima tarea
    public function getLastTask()
    {
        $sql = 'SELECT MAX(id_tarea) AS "id_tarea" FROM tareas';
        $params = null;
        return Database::getRow($sql, $params);
    }

    //Comprobar la tarea
    public function obtenerTarea()
    {
        $sql = 'SELECT tra.id_tarea, tra.observacion, tra.asignacion, tra.fecha_asignada, tra.fecha_limite, tra.apartado, 
                est.nombre_estado , tra.fk_id_empresa, tra.fk_id_folder
                FROM tareas AS tra
                INNER JOIN estados AS est ON tra.fk_id_estado = est.id_estado
                WHERE tra.id_tarea = ?';
        $params = array($this->id_tarea);
        return Database::getRow($sql, $params);
    }
    //Función para buscar 
    public function buscarTareas($value, $limit)
    {
        $sql = 'SELECT tra.id_tarea, tra.observacion, tra.asignacion, tra.fecha_asignada, tra.fecha_limite, tra.apartado, 
                est.nombre_estado , tra.fk_id_empresa, tra.fk_id_folder
                FROM tareas AS tra
                INNER JOIN estados AS est ON tra.fk_id_estado = est.id_estado
                WHERE tra.observacion ILIKE ?  OR tra.asignacion ILIKE ? OR cast(tra.fecha_asignada as varchar) ILIKE ? OR
                cast(tra.fecha_limite as varchar) ILIKE ?
                LIMIT ?';
        $params = array("%$value%", "%$value%", "%$value%", "%$value%", $limit);
        return Database::getRows($sql, $params);
    }

    //Función para buscar limite
    public function buscarTareasASG($value, $limit)
    {
        $sql = 'SELECT tra.id_tarea, tra.observacion, tra.asignacion, tra.fecha_asignada, tra.fecha_limite, tra.apartado, 
                est.nombre_estado , 
                tra.fk_id_empresa, tra.fk_id_folder, tae.fk_id_empleado
                FROM tareas AS tra
                INNER JOIN estados AS est ON tra.fk_id_estado = est.id_estado
                INNER JOIN tareas_empleados AS tae ON tae.fk_id_tarea = tra.id_tarea
                WHERE (tae.fk_id_empleado = ?) AND 
                (tra.observacion ILIKE ? OR tra.asignacion ILIKE ? OR cast(tra.fecha_asignada as varchar) ILIKE ? OR
                    cast(tra.fecha_limite as varchar) ILIKE ?)
                LIMIT ?';
        $params = array($_SESSION['id_usuario'],"%$value%", "%$value%", "%$value%", "%$value%", $limit);
        return Database::getRows($sql, $params);
    }

    /*
        Métodos para modificación de la tabla
    */
    //Crear tarea
    public function crearTarea()
    {
        $sql = 'INSERT INTO tareas (observacion,asignacion,fecha_limite,apartado,fk_id_empresa,fk_id_folder)
                VALUES(?,?,?,?,?,?)';
        $params = array($this->observacion, $this->asignacion, $this->fecha_limite, $this->apartado, $this->fk_id_empresa, $this->fk_id_folder);
        return Database::executeRow($sql, $params);
    }

    //Rechazar tarea
    public function rechazarTarea()
    {
        $sql = 'UPDATE tareas SET fk_id_estado = 7 WHERE id_tarea = ?';
        $params = array($this->id_tarea);
        return Database::executeRow($sql, $params);
    }

    //Eliminar tarea
    public function eliminarTarea()
    {
        $sql = 'DELETE FROM tareas WHERE id_tarea = ?';
        $params = array($this->id_tarea);
        return Database::executeRow($sql, $params);
    }

    //Modificar tarea
    public function modificarTarea()
    {
        $sql = 'UPDATE tareas SET observacion = ?, asignacion = ?, fecha_limite = ?, apartado = ?,
                fk_id_empresa= ?, fk_id_folder = ? WHERE id_tarea = ?';
        $params = array($this->observacion, $this->asignacion, $this->fecha_limite, $this->apartado, $this->fk_id_empresa, $this->fk_id_folder, $this->id_tarea);
        return Database::executeRow($sql, $params);
    }
}

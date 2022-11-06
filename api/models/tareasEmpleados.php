<?php
/*
*	Clase para manejar la tabla TareasEmp de la base de datos.
*   Es clase hija de Validator.
*/

class TareasEmp extends Validator
{
    // Declaración de atributos (propiedades).
    private $id_tareaemp = null;
    private $fk_id_tarea = null;
    private $fk_id_empleado = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */

    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_tareaemp = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdTarea($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->fk_id_tarea = $value;
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

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getId()
    {
        return $this->id_tareaemp;
    }
    public function getIdTarea()
    {
        return $this->fk_id_tarea;
    }

    public function getIdEmpleado()
    {
        return $this->fk_id_empleado;
    }

    /*
    *   Métodos para consultas
    */
    public function empleadosTarea()
    {
        $sql = 'SELECT tae.id_tareaemp, tae.fk_id_tarea, emp.nombre_empleado, emp.apellido_empleado, emp.id_empleado 
                FROM tareas_empleados AS tae
                INNER JOIN empleados AS emp ON tae.fk_id_empleado = emp.id_empleado
                WHERE tae.fk_id_tarea = ?';
        $params = array($this->fk_id_tarea);
        return Database::getRows($sql, $params);
    }

    //Comprobar la tarea
    public function obtenerTarea()
    {
        $sql = 'SELECT tra.id_tarea, tra.observacion, tra.asignacion, tra.fecha_asignada, tra.fecha_limite, tra.apartado, 
                est.nombre_estado , tra.fk_id_empresa, tra.fk_id_folder
                FROM tareas AS tra
                INNER JOIN estados AS est ON tra.fk_id_estado = est.id_estado
                WHERE tra.id_tarea = ?';
        $params = array($this->fk_id_tarea);
        return Database::getRow($sql, $params);
    }

    //obtener empleado
    public function obtenerEmpleado($id)
    {
        $sql = 'select e.id_empleado, e.nombre_empleado, e.apellido_empleado, e.dui_empleado, e.telefono_empleadocontc, e.correo_empleadocontc, e.usuario_empleado, tp.tipo_empleado, e.fk_id_estado, e.fk_id_tipo_empleado FROM empleados as e INNER JOIN tipo_empleado AS tp ON tp.id_tipo_empleado = e.fk_id_tipo_empleado WHERE e.id_empleado = ?';
        $params = array($id);
        return Database::getRow($sql, $params);
    }

    /*
        MÉTODOS PARA MODIFICAR TABLA
    */
    public function anadirEmp()
    {
        $sql = 'INSERT INTO tareas_empleados (fk_id_tarea, fk_id_empleado) VALUES (?,?);';
        $params = array($this->fk_id_tarea, $this->fk_id_empleado);
        return Database::executeRow($sql, $params);
    }

    public function eliminarEmpTSK()
    {
        $sql = 'DELETE FROM tareas_empleados WHERE fk_id_tarea = ? AND fk_id_empleado = ?';
        $params = array($this->fk_id_tarea, $this->fk_id_empleado);
        return Database::executeRow($sql, $params);
    }
}

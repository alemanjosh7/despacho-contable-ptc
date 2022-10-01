<?php
/*
*   Clase para manejar la tabla Valoraciones de la base de datos. 
*   Es clase hija de Validator.
*/

class ArchivosSubidosEmp extends Validator

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

    public function setIdArchSubidosEmp($value)
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
        if ($this->validateDate($value)) {
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

    public function setTamano($file)
    {
        $this->tamano = $this->validateSize($file);
        return true;
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

    public function getRoute()
    {
        return $this->ruta;
    }

    /*
    *   Metodos para consultas
    */

    //Función para consultar los archivos con limit (PARA LOS ADMINISTRADORES)
    public function obtenerArchivoLimit($limit)
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                ORDER BY arc.id_archivos_subidosemp DESC OFFSET ? LIMIT 10';
        $params = array($limit);
        return Database::getRows($sql, $params);
    }

    //Función para consultar los archivos con limit (PARA LOS EMPLEADOS)
    public function obtenerArchivoLimitEmp($limit)
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE emp.id_empleado = ? ORDER BY arc.id_archivos_subidosemp DESC OFFSET ? LIMIT 10';
        $params = array($this->fk_id_empleado, $limit);
        return Database::getRows($sql, $params);
    }

    //Buscar Archivos sin filtro (PARA ADMINISTRADORES)
    public function buscarArchivos($value)
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE (arc.nombre_original ILIKE ? OR CAST(fecha_subida as varchar) ILIKE ? OR emp.nombre_empleado ILIKE ? OR emp.apellido_empleado ILIKE ? OR empr.nombre_empresa ILIKE ? OR arc.tamano ILIKE ?) 
                ORDER BY arc.id_archivos_subidosemp DESC';
        $params = array("%$value%", "%$value%", "%$value%", "%$value%", "%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Buscar Archivos sin filtro (PARA EMPLEADOS)
    public function buscarArchivosEMP($value)
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE emp.id_empleado = ? AND (arc.nombre_original ILIKE ? OR CAST(fecha_subida as varchar) ILIKE ? OR emp.nombre_empleado ILIKE ? OR emp.apellido_empleado ILIKE ? OR empr.nombre_empresa ILIKE ? OR arc.tamano ILIKE ?) 
                ORDER BY arc.id_archivos_subidosemp DESC';
        $params = array($this->fk_id_empleado, "%$value%", "%$value%", "%$value%", "%$value%", "%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Buscar Archivos con filtro (PARA ADMINISTRADORES)
    public function buscarArchivosFilter($value)
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE empr.id_empresa = ? AND  (arc.nombre_original ILIKE ? OR CAST(fecha_subida as varchar) ILIKE ? OR emp.nombre_empleado ILIKE ? OR emp.apellido_empleado ILIKE ? OR empr.nombre_empresa ILIKE ? OR arc.tamano ILIKE ?) 
                ORDER BY arc.id_archivos_subidosemp DESC';
        $params = array($this->fk_id_empresa, "%$value%", "%$value%", "%$value%", "%$value%", "%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Buscar Archivos con filtro (PARA ADMINISTRADORES)
    public function buscarArchivosFilterEMP($value)
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE emp.id_empleado = ? AND empr.id_empresa = ? AND (arc.nombre_original ILIKE ? OR CAST(fecha_subida as varchar) ILIKE ? OR emp.nombre_empleado ILIKE ? OR emp.apellido_empleado ILIKE ? OR empr.nombre_empresa ILIKE ? OR arc.tamano ILIKE ?) 
                ORDER BY arc.id_archivos_subidosemp DESC';
        $params = array($this->fk_id_empleado, $this->fk_id_empresa, "%$value%", "%$value%", "%$value%", "%$value%", "%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Obtener Archivos con filtro (PARA ADMINISTRADORES)
    public function obtenerArchivosFilter()
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE arc.fk_id_empresa = ? 
                ORDER BY arc.id_archivos_subidosemp DESC';
        $params = array($this->fk_id_empresa);
        return Database::getRows($sql, $params);
    }

    //Obtener Archivos con filtro (PARA EMPLEADOS)
    public function obtenerArchivosFilterEMP()
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE arc.fk_id_empresa = ? AND arc.fk_id_empleado = ?
                ORDER BY arc.id_archivos_subidosemp DESC';
        $params = array($this->fk_id_empresa, $this->fk_id_empleado);
        return Database::getRows($sql, $params);
    }

    //Obtener un archivo especifico
    public function obtenerArchivo()
    {
        $sql = 'SELECT arc.id_archivos_subidosemp, arc.nombre_archivo, arc.fecha_subida, arc.descripcion, emp.nombre_empleado, emp.apellido_empleado, arc.fk_id_empleado, arc.fk_id_empresa, empr.nombre_empresa, arc.fk_id_estado, arc.tamano, arc.nombre_original 
                FROM archivos_subidosemp AS arc
                INNER JOIN empleados AS emp ON arc.fk_id_empleado = emp.id_empleado
                INNER JOIN empresas AS empr ON arc.fk_id_empresa = empr.id_empresa
                WHERE arc.id_archivos_subidosemp = ?';
        $params = array($this->id_archivos_subidosemp);
        return Database::getRow($sql, $params);
    }
    //Metodos SCRUD (Search, Create, Read, Update, Delete)

    public function crearArchivoEmp()
    {
        $sql = 'INSERT INTO archivos_subidosemp	(nombre_archivo, descripcion, fk_id_empleado, fk_id_empresa, tamano, nombre_original)
        VALUES (?,?,?,?,?,?)';
        $params = array($this->nombre_archivo, $this->descripcion, $this->fk_id_empleado, $this->fk_id_empresa, $this->tamano, $this->nombre_original);
        return Database::executeRow($sql, $params);
    }


    public function actualizarArchivoEmp()
    {
        $sql = 'update archivos_subidosemp set nombre_archivo = ?, fecha_subida = ?, descripcion = ?, fk_id_empleado = ?, fk_id_empresa = ?, fk_id_estado = ?, tamano = ?, nombre_original = ?
        where id_archivos_subidosemp = ?';
        $params = array(
            $this->nombre_archivo, $this->fecha_subida, $this->descripcion, $this->fk_id_empleado, $this->fk_id_empresa, $this->fk_id_estado, $this->tamano, $this->nombre_original,
            $this->id_archivos_subidosemp
        );
        return Database::executeRow($sql, $params);
    }

    public function eliminarArchivoEmp()
    {
        $sql = 'DELETE from archivos_subidosemp WHERE id_archivos_subidosemp = ? AND fk_id_empleado = ?';
        $params = array($this->id_archivos_subidosemp, $this->fk_id_empleado);
        return Database::executeRow($sql, $params);
    }

    //Actualizar el estado del archivo a descargado
    public function estadoDesc()
    {
        $sql = 'UPDATE archivos_subidosemp SET fk_id_estado = 2 WHERE id_archivos_subidosemp = ? AND fk_id_empleado = ?';
        $params = array($this->id_archivos_subidosemp, $this->fk_id_empleado);
        return Database::executeRow($sql, $params);
    }

    //Actualizar estado a eliminado del archivo
    public function actualizarEstadoDEL()
    {
        $sql = 'UPDATE archivos_subidosemp SET fk_id_estado = 3 WHERE id_archivos_subidosemp = ? AND fk_id_empleado = ?';
        $params = array($this->id_archivos_subidosemp, $this->fk_id_empleado);
        return Database::executeRow($sql, $params);
    }

    /*
        FUNCIONES PARA LOS REPORTES
    */
    //Función para el resumen de los archivos subidos por el usuario que inicio session
    public function reporteArchivosInf()
    {
        $punto = '.';
        $sql = 'SELECT arc.nombre_original,arc.tamano,est.nombre_estado,emp.nombre_empresa,arc.fecha_subida,arc.descripcion,split_part(arc.nombre_archivo,?,2) AS tipo
                FROM archivos_subidosemp as arc
                INNER JOIN empresas AS emp ON arc.fk_id_empresa = emp.id_empresa
                INNER JOIN estados AS est ON arc.fk_id_estado = est.id_estado
                WHERE arc.fk_id_empleado = ? AND arc.fk_id_estado !=3';
        $params = array($punto,$_SESSION['id_usuario']);
        return Database::getRows($sql, $params);
    }
    
    //Función que obtenga los empleados que subieron archivos en x fechas
    public function reporteEmpSFX($fechai, $fechaf)
    {
        $sql = 'SELECT emp.nombre_empleado, COUNT(ase.fk_id_empleado) AS numeros FROM archivos_subidosemp AS ase
                INNER JOIN empleados AS emp ON ase.fk_id_empleado = emp.id_empleado
                WHERE ase.fecha_subida >= ? AND ase.fecha_subida <= ?
                GROUP BY emp.nombre_empleado ORDER BY COUNT(ase.fk_id_empleado) DESC';
        $params = array($fechai, $fechaf);
        return Database::getRows($sql, $params);
    }

    //Función de top 3 empleados con más archivos filtrado por tipo
    public function top3EmpleadosArchivos($value)
    {
        $sql = 'select emp.nombre_empleado, emp.apellido_empleado, count(archsubidos.fk_id_empleado) as cuenta
                from archivos_subidosemp as archsubidos inner join empleados as emp ON archsubidos.fk_id_empleado = emp.id_empleado 
                where emp.fk_id_estado !=3 AND emp.fk_id_tipo_empleado = ? 
                group by emp.nombre_empleado, emp.apellido_empleado order by cuenta desc limit 3';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Funcion de reporte para mostrar los empleados con mas registro de archivos
    public function registroArchivoEmpleado()
    {
        $sql = 'SELECT nombre_empleado, apellido_empleado, tipo_empleado, COUNT(fk_id_empleado) AS subidas from archivos_subidosemp
                INNER JOIN empleados ON id_empleado = "fk_id_empleado" 
                INNER JOIN tipo_empleado ON id_tipo_empleado = "fk_id_tipo_empleado"
                GROUP BY nombre_empleado, apellido_empleado, tipo_empleado';
        $params = null;
        return Database::getRows($sql, $params);
    }
}

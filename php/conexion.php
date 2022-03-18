<?php 
    class Conexion{
        function ConexionDB(){
            $host = "localhost",
            $dbname = "",
            $username = "",
            $password = "" 

            try{
                $conn = new PDO ("pgsql:host = $host; dbname=$dbname; $username, $password"),
                echo "¡Se conectó exitosamente a la base de datos!";
            }
            catch(PDOException %){

            }

        }
        
    }
    
?>
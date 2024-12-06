<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php'; // Archivo para la conexión a la base de datos

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['entidad'])) {
            if ($_GET['entidad'] === 'empleados') {
                $stmt = $conn->query("SELECT empleados.*, lineas.nombre AS linea_nombre FROM empleados LEFT JOIN lineas ON empleados.linea_id = lineas.id");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($_GET['entidad'] === 'lineas') {
                $stmt = $conn->query("SELECT * FROM lineas");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($_GET['entidad'] === 'vacaciones') {
                $stmt = $conn->query("SELECT vacaciones.*, empleados.nombre AS empleado_nombre, empleados.apellido AS empleado_apellido FROM vacaciones INNER JOIN empleados ON vacaciones.empleado_id = empleados.id");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
        } else {
            echo json_encode(["error" => "Entidad no especificada"]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['entidad'])) {
            if ($data['entidad'] === 'empleados') {
                $stmt = $conn->prepare("INSERT INTO empleados (nombre, apellido, cargo, fecha_ingreso, direccion, localidad, provincia, codigo_postal, dni, tipo_relacion, linea_id, correo, telefono) VALUES (:nombre, :apellido, :cargo, :fecha_ingreso, :direccion, :localidad, :provincia, :codigo_postal, :dni, :tipo_relacion, :linea_id, :correo, :telefono)");
                $stmt->execute($data);
                echo json_encode(["message" => "Empleado agregado correctamente"]);
            } elseif ($data['entidad'] === 'lineas') {
                $stmt = $conn->prepare("INSERT INTO lineas (nombre, oficina) VALUES (:nombre, :oficina)");
                $stmt->execute($data);
                echo json_encode(["message" => "Línea agregada correctamente"]);
            } elseif ($data['entidad'] === 'vacaciones') {
                $stmt = $conn->prepare("INSERT INTO vacaciones (empleado_id, fecha_inicio, fecha_fin, dias_tomados) VALUES (:empleado_id, :fecha_inicio, :fecha_fin, :dias_tomados)");
                $dias_tomados = (new DateTime($data['fecha_fin']))->diff(new DateTime($data['fecha_inicio']))->days + 1;
                $stmt->execute(array_merge($data, ['dias_tomados' => $dias_tomados]));
                echo json_encode(["message" => "Vacación agregada correctamente"]);
            }
        } else {
            echo json_encode(["error" => "Entidad no especificada"]);
        }
        break;

    case 'PUT':
        parse_str(file_get_contents("php://input"), $data);
        if (isset($data['entidad']) && isset($data['id'])) {
            if ($data['entidad'] === 'empleados') {
                $stmt = $conn->prepare("UPDATE empleados SET nombre = :nombre, apellido = :apellido, cargo = :cargo, fecha_ingreso = :fecha_ingreso, direccion = :direccion, localidad = :localidad, provincia = :provincia, codigo_postal = :codigo_postal, dni = :dni, tipo_relacion = :tipo_relacion, linea_id = :linea_id, correo = :correo, telefono = :telefono WHERE id = :id");
                $stmt->execute($data);
                echo json_encode(["message" => "Empleado actualizado correctamente"]);
            }
        } else {
            echo json_encode(["error" => "Entidad o ID no especificados"]);
        }
        break;

        case 'DELETE':
            parse_str(file_get_contents("php://input"), $data);
            if (isset($_GET['entidad']) && $_GET['entidad'] === 'lineas' && isset($_GET['id'])) {
                $stmt = $conn->prepare("DELETE FROM lineas WHERE id = :id");
                $stmt->execute([':id' => $_GET['id']]);
                if ($stmt->rowCount() > 0) {
                    echo json_encode(["message" => "Línea eliminada correctamente"]);
                } else {
                    echo json_encode(["error" => "Línea con ID {$_GET['id']} no existe"]);
                }
            }
            break;
        
    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
?>

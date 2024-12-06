import React, { useContext, useState, useEffect } from "react";
import api from "../api";
import { EmployeeContext } from "../EmployeeContext";

const Page1 = () => {
  const { employees, setEmployees, lines, setLines } = useContext(EmployeeContext);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cargo: '',
    fecha_ingreso: '',
    direccion: '',
    localidad: '',
    provincia: '',
    codigo_postal: '',
    dni: '',
    tipo_relacion: '',
    linea_id: '',
    correo: '',
    telefono: '',
  });
  const [editando, setEditando] = useState(null);

  // Cargar líneas al inicio
  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await api.get("?entidad=lineas");
        setLines(response.data);
      } catch (error) {
        console.error("Error al cargar líneas:", error);
      }
    };

    fetchLines();
  }, [setLines]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Agregar empleado
  const agregarEmpleado = async () => {
    const camposObligatorios = ['nombre', 'apellido', 'linea_id', 'dni'];
    const camposVacios = camposObligatorios.filter((campo) => !formData[campo]);

    if (camposVacios.length > 0) {
      alert(`Los siguientes campos son obligatorios: ${camposVacios.join(', ')}`);
      return;
    }

    try {
      const nuevoEmpleado = { entidad: "empleados", ...formData };
      const response = await api.post("", nuevoEmpleado);
      setEmployees([...employees, { ...nuevoEmpleado, id: response.data.id }]);
      limpiarCampos();
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  // Editar empleado
  const editarEmpleado = (empleado) => {
    setEditando(empleado.id);
    setFormData({
      ...empleado,
      fecha_ingreso: empleado.fecha_ingreso
        ? empleado.fecha_ingreso.split("/").reverse().join("-")
        : "",
    });
  };

  // Actualizar empleado
  const actualizarEmpleado = async () => {
    try {
      const updatedEmpleado = { entidad: "empleados", id: editando, ...formData };
      await api.put("", updatedEmpleado);
      setEmployees(
        employees.map((empleado) =>
          empleado.id === editando ? { ...updatedEmpleado } : empleado
        )
      );
      limpiarCampos();
      setEditando(null);
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
    }
  };

  // Eliminar empleado
  const eliminarEmpleado = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await api.delete("", { data: { entidad: "empleados", id } });
        setEmployees(employees.filter((empleado) => empleado.id !== id));
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
      }
    }
  };

  const limpiarCampos = () => {
    setFormData({
      nombre: '',
      apellido: '',
      cargo: '',
      fecha_ingreso: '',
      direccion: '',
      localidad: '',
      provincia: '',
      codigo_postal: '',
      dni: '',
      tipo_relacion: '',
      linea_id: '',
      correo: '',
      telefono: '',
    });
  };

  return (
    <div className="content">
      <h1>Gestión de Empleados</h1>
      <div>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          placeholder="Nombre *"
        />
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          placeholder="Apellido *"
        />
        <input
          type="text"
          name="cargo"
          value={formData.cargo}
          onChange={handleInputChange}
          placeholder="Cargo"
        />
        <input
          type="date"
          name="fecha_ingreso"
          value={formData.fecha_ingreso}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
          placeholder="Dirección"
        />
        <input
          type="text"
          name="localidad"
          value={formData.localidad}
          onChange={handleInputChange}
          placeholder="Localidad"
        />
        <input
          type="text"
          name="provincia"
          value={formData.provincia}
          onChange={handleInputChange}
          placeholder="Provincia"
        />
        <input
          type="text"
          name="codigo_postal"
          value={formData.codigo_postal}
          onChange={handleInputChange}
          placeholder="Código Postal"
        />
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleInputChange}
          placeholder="DNI *"
        />
        <select
          name="tipo_relacion"
          value={formData.tipo_relacion}
          onChange={handleInputChange}
        >
          <option value="">Tipo de Relación</option>
          <option value="Monotributista">Monotributista</option>
          <option value="Dependencia">Dependencia</option>
        </select>
        <select
          name="linea_id"
          value={formData.linea_id}
          onChange={handleInputChange}
        >
          <option value="">Seleccione una línea *</option>
          {lines.map((linea) => (
            <option key={linea.id} value={linea.id}>
              {linea.nombre}
            </option>
          ))}
        </select>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          placeholder="Correo Electrónico"
        />
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          placeholder="Teléfono"
        />
        <button onClick={editando ? actualizarEmpleado : agregarEmpleado}>
          {editando ? "Actualizar" : "Agregar"}
        </button>
      </div>

      <h2>Lista de Empleados</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.nombre}</td>
              <td>{empleado.apellido}</td>
              <td>{empleado.cargo}</td>
              <td>
                <button onClick={() => editarEmpleado(empleado)}>Editar</button>
                <button onClick={() => eliminarEmpleado(empleado.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page1;


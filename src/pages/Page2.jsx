import React, { useContext, useState, useEffect } from "react";
import api from "../api";
import { EmployeeContext } from "../EmployeeContext";

const Page2 = () => {
  const { employees, setEmployees } = useContext(EmployeeContext);
  const [vacations, setVacations] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Cargar vacaciones al inicio
  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await api.get("?entidad=vacaciones");
        setVacations(response.data);
      } catch (error) {
        console.error("Error al cargar vacaciones:", error);
      }
    };

    fetchVacations();
  }, []);

  const agregarVacacion = async () => {
    if (!selectedEmployeeId || !startDate || !endDate) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    try {
      const nuevaVacacion = {
        entidad: "vacaciones",
        empleado_id: selectedEmployeeId,
        fecha_inicio: startDate,
        fecha_fin: endDate,
      };
      const response = await api.post("", nuevaVacacion);
      setVacations([...vacations, { ...nuevaVacacion, id: response.data.id }]);
      limpiarCampos();
    } catch (error) {
      console.error("Error al agregar vacación:", error);
    }
  };

  const editarVacacion = (vacacion) => {
    setEditingId(vacacion.id);
    setSelectedEmployeeId(vacacion.empleado_id);
    setStartDate(vacacion.fecha_inicio.split("/").reverse().join("-"));
    setEndDate(vacacion.fecha_fin.split("/").reverse().join("-"));
  };

  const actualizarVacacion = async () => {
    if (!selectedEmployeeId || !startDate || !endDate) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    try {
      const updatedVacacion = {
        entidad: "vacaciones",
        id: editingId,
        empleado_id: selectedEmployeeId,
        fecha_inicio: startDate,
        fecha_fin: endDate,
      };
      await api.put("", updatedVacacion);
      setVacations(
        vacations.map((vacacion) =>
          vacacion.id === editingId ? updatedVacacion : vacacion
        )
      );
      limpiarCampos();
      setEditingId(null);
    } catch (error) {
      console.error("Error al actualizar vacación:", error);
    }
  };

  const eliminarVacacion = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta vacación?")) {
      try {
        await api.delete("", { data: { entidad: "vacaciones", id } });
        setVacations(vacations.filter((vacacion) => vacacion.id !== id));
      } catch (error) {
        console.error("Error al eliminar vacación:", error);
      }
    }
  };

  const limpiarCampos = () => {
    setSelectedEmployeeId("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="content">
      <h1>Gestión de Vacaciones</h1>
      <select
        value={selectedEmployeeId}
        onChange={(e) => setSelectedEmployeeId(e.target.value)}
        className="form-control"
      >
        <option value="">Seleccione un empleado</option>
        {employees.map((empleado) => (
          <option key={empleado.id} value={empleado.id}>
            {empleado.nombre} {empleado.apellido}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="form-control my-2"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="form-control"
      />
      <button
        onClick={editingId ? actualizarVacacion : agregarVacacion}
        className="btn btn-primary mt-2"
      >
        {editingId ? "Actualizar Vacación" : "Agregar Vacación"}
      </button>

      <table className="table table-bordered mt-3">
        <thead className="thead-light">
          <tr>
            <th>Empleado</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vacations.map((vacacion) => (
            <tr key={vacacion.id}>
              <td>
                {vacacion.empleado_nombre} {vacacion.empleado_apellido}
              </td>
              <td>{vacacion.fecha_inicio}</td>
              <td>{vacacion.fecha_fin}</td>
              <td>
                <button
                  onClick={() => editarVacacion(vacacion)}
                  className="btn btn-warning btn-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarVacacion(vacacion.id)}
                  className="btn btn-danger btn-sm"
                >
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

export default Page2;

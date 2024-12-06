import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../contexts/EmployeeContext';
import api from '../api';

const Vacations = () => {
  const { employees } = useContext(EmployeeContext);
  const [vacations, setVacations] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Cargar vacaciones al iniciar
  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await api.get('?entidad=vacaciones');
        setVacations(response.data);
      } catch (error) {
        console.error('Error al cargar vacaciones:', error);
      }
    };

    fetchVacations();
  }, []);

  const handleAddVacation = async () => {
    if (!selectedEmployeeId || !startDate || !endDate) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    try {
      const nuevaVacacion = {
        entidad: 'vacaciones',
        empleado_id: selectedEmployeeId,
        fecha_inicio: startDate,
        fecha_fin: endDate,
      };

      if (editingId) {
        // Actualizar vacación existente
        await api.put('', { ...nuevaVacacion, id: editingId });
        setVacations(
          vacations.map((vacacion) =>
            vacacion.id === editingId ? { ...nuevaVacacion, id: editingId } : vacacion
          )
        );
      } else {
        // Agregar nueva vacación
        const response = await api.post('', nuevaVacacion);
        setVacations([...vacations, { ...nuevaVacacion, id: response.data.id }]);
      }

      clearFields();
    } catch (error) {
      console.error('Error al agregar/actualizar vacación:', error);
    }
  };

  const handleEditVacation = (vacacion) => {
    setEditingId(vacacion.id);
    setSelectedEmployeeId(vacacion.empleado_id.toString());
    setStartDate(vacacion.fecha_inicio.split('/').reverse().join('-'));
    setEndDate(vacacion.fecha_fin.split('/').reverse().join('-'));
  };

  const handleDeleteVacation = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta vacación?')) {
      try {
        await api.delete('', { data: { entidad: 'vacaciones', id } });
        setVacations(vacations.filter((vacacion) => vacacion.id !== id));
      } catch (error) {
        console.error('Error al eliminar vacación:', error);
      }
    }
  };

  const clearFields = () => {
    setSelectedEmployeeId('');
    setStartDate('');
    setEndDate('');
    setEditingId(null);
  };

  return (
    <div className="content">
      <h1>Gestión de Vacaciones</h1>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="empleado">Empleado</label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="form-control"
            id="empleado"
          >
            <option value="">Seleccione un empleado</option>
            {employees.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre} {empleado.apellido}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Fecha de Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
            id="startDate"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Fecha de Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
            id="endDate"
          />
        </div>
      </div>
      <button
        onClick={handleAddVacation}
        className="btn btn-primary mt-3"
      >
        {editingId ? 'Actualizar Vacación' : 'Agregar Vacación'}
      </button>
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
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
                    onClick={() => handleEditVacation(vacacion)}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteVacation(vacacion.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {vacations.length === 0 && (
              <tr>
                <td colSpan="4">No hay vacaciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vacations;

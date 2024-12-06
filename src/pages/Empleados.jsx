// src/pages/Empleados.jsx
import React, { useContext, useState, useEffect } from 'react';
import api from '../api'; // Asegúrate de que este archivo existe
import { EmployeeContext } from '../contexts/EmployeeContext';
import { LinesContext } from '../contexts/LinesContext';
import { format } from 'date-fns';

const Empleados = () => {
  const { employees, setEmployees } = useContext(EmployeeContext);
  const { lines, setLines } = useContext(LinesContext);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cargo: '',
    fechaIngreso: '',
    direccion: '',
    localidad: '',
    provincia: '',
    codigoPostal: '',
    dni: '',
    tipoRelacion: '',
    linea_id: '',
    email: '',
    telefono: '',
  });

  // Cargar líneas desde el backend si no están en el contexto
  useEffect(() => {
    const fetchLines = async () => {
      if (lines.length === 0) {
        try {
          const response = await api.get('?entidad=lineas');
          setLines(response.data);
        } catch (error) {
          console.error('Error al cargar líneas:', error);
        }
      }
    };
    fetchLines();
  }, [lines, setLines]);

  // Iniciar la edición de un empleado
  const startEditing = (employee) => {
    setEditingEmployeeId(employee.id);
    setFormData({
      ...employee,
      fechaIngreso: employee.fechaIngreso
        ? employee.fechaIngreso.split('/').reverse().join('-')
        : '',
      linea_id: employee.linea_id || '',
    });
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar los cambios de edición
  const saveChanges = async () => {
    const errores = [];
    if (!formData.nombre) errores.push('El nombre es obligatorio.');
    if (!formData.apellido) errores.push('El apellido es obligatorio.');
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errores.push('El correo electrónico no es válido.');

    if (errores.length > 0) {
      alert(errores.join('\n'));
      return;
    }

    try {
      const updatedEmployee = {
        ...formData,
        id: editingEmployeeId,
        fechaIngreso: formData.fechaIngreso
          ? format(new Date(formData.fechaIngreso), 'dd/MM/yyyy')
          : '',
      };
      await api.put('', { entidad: 'empleados', ...updatedEmployee });

      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployeeId ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
      cancelEditing();
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
    }
  };

  // Cancelar la edición
  const cancelEditing = () => {
    setEditingEmployeeId(null);
    setFormData({
      nombre: '',
      apellido: '',
      cargo: '',
      fechaIngreso: '',
      direccion: '',
      localidad: '',
      provincia: '',
      codigoPostal: '',
      dni: '',
      tipoRelacion: '',
      linea_id: '',
      email: '',
      telefono: '',
    });
  };

  // Eliminar un empleado
  const deleteEmployee = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await api.delete('', { data: { entidad: 'empleados', id } });
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  return (
    <div className="content">
      <h1>Empleados</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cargo</th>
              <th>Fecha de Ingreso</th>
              <th>Dirección</th>
              <th>Localidad</th>
              <th>Provincia</th>
              <th>Código Postal</th>
              <th>DNI</th>
              <th>Relación</th>
              <th>Línea</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((empleado) => (
              <tr key={empleado.id}>
                {editingEmployeeId === empleado.id ? (
                  <>
                    {/* Campos de edición */}
                    <td>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </td>
                    {/* Otros campos */}
                    {/* ... */}
                    <td>
                      <button onClick={saveChanges} className="btn btn-success btn-sm">
                        Guardar
                      </button>
                      <button onClick={cancelEditing} className="btn btn-secondary btn-sm">
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* Mostrar datos del empleado */}
                    <td>{empleado.nombre}</td>
                    <td>{empleado.apellido}</td>
                    <td>{empleado.cargo}</td>
                    {/* Otros datos */}
                    {/* ... */}
                    <td>
                      <button
                        onClick={() => startEditing(empleado)}
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteEmployee(empleado.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="14">No hay empleados registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empleados;


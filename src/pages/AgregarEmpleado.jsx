import React, { useEffect, useState } from 'react';
import api from '../api';

const AgregarEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [lineas, setLineas] = useState([]);

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

  // Cargar empleados y líneas al inicio
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [empleadosResponse, lineasResponse] = await Promise.all([
          api.get('?entidad=empleados'),
          api.get('?entidad=lineas'),
        ]);
        setEmpleados(empleadosResponse.data);
        setLineas(lineasResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchDatos();
  }, []);

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
      const nuevoEmpleado = { entidad: 'empleados', ...formData };
      await api.post('', nuevoEmpleado);

      // Refrescar la lista de empleados desde el backend
      const empleadosResponse = await api.get('?entidad=empleados');
      setEmpleados(empleadosResponse.data);

      limpiarCampos();
    } catch (error) {
      console.error('Error al agregar empleado:', error);
    }
  };

  // Limpiar campos del formulario
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
    <div>
      <h1>Agregar Empleado</h1>
      <div>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre*"
          value={formData.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido*"
          value={formData.apellido}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cargo"
          placeholder="Cargo"
          value={formData.cargo}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="fecha_ingreso"
          placeholder="Fecha de Ingreso"
          value={formData.fecha_ingreso}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="localidad"
          placeholder="Localidad"
          value={formData.localidad}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="provincia"
          placeholder="Provincia"
          value={formData.provincia}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="codigo_postal"
          placeholder="Código Postal"
          value={formData.codigo_postal}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI*"
          value={formData.dni}
          onChange={handleInputChange}
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
          <option value="">Seleccione una línea*</option>
          {lineas.map((linea) => (
            <option key={linea.id} value={linea.id}>
              {linea.nombre}
            </option>
          ))}
        </select>
        <input
          type="email"
          name="correo"
          placeholder="Correo Electrónico"
          value={formData.correo}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleInputChange}
        />
        <button onClick={agregarEmpleado}>Agregar</button>
      </div>

      <h2>Lista de Empleados</h2>
      <ul>
        {empleados.map((empleado) => (
          <li key={empleado.id}>
            {empleado.nombre} {empleado.apellido} - {empleado.cargo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgregarEmpleado;

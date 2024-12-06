import React, { useContext, useState, useEffect } from 'react';
import { LinesContext } from '../contexts/LinesContext';
import api from '../api';

const LinesPage = () => {
  const { lines, setLines } = useContext(LinesContext);
  const [nombre, setNombre] = useState('');
  const [oficina, setOficina] = useState('');

  // Cargar líneas desde el backend al iniciar
  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await api.get('?entidad=lineas');
        setLines(response.data);
      } catch (error) {
        console.error('Error al cargar líneas:', error);
      }
    };

    fetchLines();
  }, [setLines]);

  // Agregar línea
  const agregarLinea = async () => {
    if (!nombre || !oficina) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      const nuevaLinea = { entidad: 'lineas', nombre, oficina };
      const response = await api.post('', nuevaLinea);
      setLines([...lines, { ...nuevaLinea, id: response.data.id }]);
      setNombre('');
      setOficina('');
    } catch (error) {
      console.error('Error al agregar línea:', error);
    }
  };

  // Eliminar línea
  const eliminarLinea = async (id) => {
    console.log('Intentando eliminar la línea con ID:', id); // Verificar el ID
    if (window.confirm('¿Estás seguro de que deseas eliminar esta línea?')) {
      try {
        await api.delete(`?entidad=lineas&id=${id}`);
        setLines(lines.filter((linea) => linea.id !== id)); // Actualizar el estado local
      } catch (error) {
        console.error('Error al eliminar línea:', error);
      }
    }
  };
  
  

  return (
    <div className="content">
      <h1>Líneas de Ferrocarril</h1>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="nombreLinea">Nombre de la Línea</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
            id="nombreLinea"
            placeholder="Nombre de la línea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="oficina">Oficina</label>
          <input
            type="text"
            value={oficina}
            onChange={(e) => setOficina(e.target.value)}
            className="form-control"
            id="oficina"
            placeholder="Oficina"
          />
        </div>
      </div>
      <button onClick={agregarLinea} className="btn btn-primary mt-3">
        Agregar Línea
      </button>
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Nombre</th>
              <th>Oficina</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((linea) => (
              <tr key={linea.id}>
                <td>{linea.nombre}</td>
                <td>{linea.oficina}</td>
                <td>
                  <button
                    onClick={() => eliminarLinea(linea.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {lines.length === 0 && (
              <tr>
                <td colSpan="3">No hay líneas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinesPage;

import React, { useState, useEffect } from 'react';

const CreateProductButton = ({ onProductCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    receta_nombre: '',
    cantidad_inventario: 0,
    clasificacion: '',
    cantidad_inventario_minimo: 0,
  });
  const [recipeList, setRecipeList] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + '/dashboard/recipes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching recipes');
      }

      const recipes = await response.json();
      setRecipeList(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + '/dashboard/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error creating product');
      }

      const productData = await response.json();

      handleClose();

      if (onProductCreated) {
        onProductCreated(productData);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        New Product
      </button>

      {showModal && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Product</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="formRecetaNombre" className="form-label">
                      Product Name
                    </label>
                    <select
                      className="form-select"
                      id="formRecetaNombre"
                      name="receta_nombre"
                      value={formData.receta_nombre}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select one Recipe Name
                      </option>
                      {recipeList.map((recipe) => (
                        <option key={recipe.id} value={recipe.nombre}>
                          {recipe.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formCantidadInventario" className="form-label">
                      Quantity in Storage
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="formCantidadInventario"
                      placeholder="Cantidad en inventario"
                      name="cantidad_inventario"
                      value={formData.cantidad_inventario}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formClasificacion" className="form-label">
                      Classification
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="formClasificacion"
                      placeholder="Clasificación del producto"
                      name="clasificacion"
                      value={formData.clasificacion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formCantidadInventarioMinimo" className="form-label">
                      Alert Me When I Have
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="formCantidadInventarioMinimo"
                      placeholder="Cantidad mínima en inventario"
                      name="cantidad_inventario_minimo"
                      value={formData.cantidad_inventario_minimo}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProductButton;
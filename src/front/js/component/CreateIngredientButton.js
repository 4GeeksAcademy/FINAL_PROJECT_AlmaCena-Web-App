import React, { useState } from "react";

const CreateIngredientButton = ({ onIngredientCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    clasificacion: "",
    unidad_medida: "",
    cantidad: 0,
    minimo_stock: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("jwt-token");

      const response = await fetch(process.env.BACKEND_URL + "/dashboard/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error creating ingredient");
      }

      setShowModal(false);

      if (onIngredientCreated) {
        onIngredientCreated();
      }
    } catch (error) {
      console.error("Error creating ingredient:", error);
      // Maneja el error
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        New Ingredient
      </button>

      {showModal && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Ingredient</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="formNombre" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="formNombre"
                      placeholder="Ingredient Name"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formClasificacion" className="form-label">
                      Category
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="formClasificacion"
                      placeholder="Ingredient Category"
                      name="clasificacion"
                      value={formData.clasificacion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formUnidadMedida" className="form-label">
                      Unit
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="formUnidadMedida"
                      placeholder="Units: Kilos, Grams, Litres..."
                      name="unidad_medida"
                      value={formData.unidad_medida}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formCantidad" className="form-label">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="formCantidad"
                      placeholder="Quantity"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formMinimoStock" className="form-label">
                      Min Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="formMinimoStock"
                      placeholder="Alert When I Have"
                      name="minimo_stock"
                      value={formData.minimo_stock}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
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

export default CreateIngredientButton;

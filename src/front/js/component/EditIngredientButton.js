import React, { useState } from "react";

const EditIngredientButton = ({ ingredient, onIngredientUpdated }) => {
  const [show, setShow] = useState(false);
  const [cantidadStock, setCantidadStock] = useState(ingredient.cantidad_stock);
  const [minimoStock, setMinimoStock] = useState(ingredient.minimo_stock);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setCantidadStock(ingredient.cantidad_stock);
    setMinimoStock(ingredient.minimo_stock);
    setShow(true);
  };

  const handleUpdateIngredient = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/ingredients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
        },
        body: JSON.stringify({
          materia_prima_id: ingredient.materia_prima_id,
          cantidad_stock: cantidadStock,
          minimo_stock: minimoStock
        })
      });

      if (!response.ok) {
        throw new Error("Error updating ingredient");
      }

      // Cierra el modal
      handleClose();

      // Llama a la función onIngredientUpdated para actualizar la lista de ingredientes
      if (onIngredientUpdated) {
        onIngredientUpdated();
      }
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  return (
    <>
      <button className="btn btn-warning edit-ingredients" onClick={handleShow}>
        <i className="far fa-edit"></i>
      </button>

      {show && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Ingredient</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="formCantidadStock" className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="formCantidadStock"
                      placeholder="Enter cantidad stock"
                      value={cantidadStock}
                      onChange={(e) => setCantidadStock(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formMinimoStock" className="form-label">Alert Me When I Have</label>
                    <input
                      type="number"
                      className="form-control"
                      id="formMinimoStock"
                      placeholder="Enter minimo stock"
                      value={minimoStock}
                      onChange={(e) => setMinimoStock(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateIngredient}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditIngredientButton;

import React, { useState } from "react";

const DeleteIngredientButton = ({ ingredient, onIngredientDeleted }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleDeleteIngredient = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/ingredients", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({
          materia_prima_id: ingredient.materia_prima_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error deleting ingredient");
      }

      // Cierra el modal
      handleClose();

      // Llama a la función onIngredientDeleted para actualizar la lista de materias primas
      if (onIngredientDeleted) {
        onIngredientDeleted();
      }
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };

  return (
    <>
      <button className="btn btn-danger delete-recipe" onClick={handleShow}>
        <i className="far fa-trash-alt"></i>
      </button>

      {show && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Ingredient</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the ingredient: {ingredient.nombre}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteIngredient}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteIngredientButton;

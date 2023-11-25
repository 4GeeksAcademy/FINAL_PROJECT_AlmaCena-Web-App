import React, { useState } from "react";

const DeleteRecipeButton = ({ recipe, onRecipeDeleted }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteRecipe = async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/dashboard/recipes/${recipe.receta_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting recipe");
      }

      handleClose();

      if (onRecipeDeleted) {
        onRecipeDeleted();
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
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
                <h5 className="modal-title">Delete Recipe</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {recipe.nombre}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteRecipe}>
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

export default DeleteRecipeButton;

import React from "react";

const DeleteProductButton = ({ product, onProductDeleted }) => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({
          product_id: product.receta_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error deleting product");
      }

      handleClose();

      if (onProductDeleted) {
        onProductDeleted();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <button className="btn btn-danger delete-recipe" onClick={handleShow}>
        <i className="far fa-trash-alt"></i><span className="text-white ps-2 texto-boton">Delete</span>
      </button>

      {show && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Product</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {product.nombre}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteProduct}>
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

export default DeleteProductButton;

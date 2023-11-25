import React, { useState } from "react";

const EditProductButton = ({ product, onProductEdited }) => {
  const [show, setShow] = useState(false);
  const [cantidadInventario, setCantidadInventario] = useState(product.cantidad_inventario || "");
  const [clasificacion, setClasificacion] = useState(product.clasificacion || "");
  const [cantidadInventarioMinimo, setCantidadInventarioMinimo] = useState(
    product.cantidad_inventario_minimo || ""
  );

  const handleClose = () => {
    setShow(false);
    setCantidadInventario(product.cantidad_inventario || "");
    setClasificacion(product.clasificacion || "");
    setCantidadInventarioMinimo(product.cantidad_inventario_minimo || "");
  };

  const handleShow = () => setShow(true);

  const handleEditProduct = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
        },
        body: JSON.stringify({
          id: product.receta_id,
          cantidad_inventario: cantidadInventario,
          clasificacion: clasificacion,
          cantidad_inventario_minimo: cantidadInventarioMinimo
        })
      });

      if (!response.ok) {
        throw new Error("Error editing product");
      }

      handleClose();

      if (onProductEdited) {
        onProductEdited();
      }
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  return (
    <>
      <button className="btn btn-warning">
        <i className="far fa-edit"></i><span className="text-white ps-2 texto-boton" onClick={handleShow}>Edit</span>
      </button>

      {show && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="formCantidadInventario" className="form-label">Quantity in Storage</label>
                    <input
                      type="number"
                      className="form-control"
                      id="formCantidadInventario"
                      placeholder="Enter cantidad inventario"
                      value={cantidadInventario}
                      onChange={(e) => setCantidadInventario(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formClasificacion" className="form-label">Classification</label>
                    <input
                      type="text"
                      className="form-control"
                      id="formClasificacion"
                      placeholder="Enter clasificacion"
                      value={clasificacion}
                      onChange={(e) => setClasificacion(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formCantidadInventarioMinimo" className="form-label">Alert Me When I Have</label>
                    <input
                      type="number"
                      className="form-control"
                      id="formCantidadInventarioMinimo"
                      placeholder="Enter cantidad inventario mínimo"
                      value={cantidadInventarioMinimo}
                      onChange={(e) => setCantidadInventarioMinimo(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditProduct}>
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

export default EditProductButton;

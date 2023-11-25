import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlmaCenaSidebar from "../component/AlmaCenaSidebar";
import CreateProductButton from "../component/CreateProductButton";
import EditProductButton from "../component/EditProductButton";
import DeleteProductButton from "../component/DeleteProductButton";

export const Products = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt-token");

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        process.env.BACKEND_URL + "/dashboard/products",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401) {
        navigate("/login");
      }
      if (!response.ok) {
        throw new Error("Error fetching products");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products. Please try again.");
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleProductEdited = () => {
    fetchProducts();
  };

  const handleProductDeleted = () => {
    fetchProducts();
  };

  return (
    <div className="container-fluid">
      <div className="row principal-products">
        <div className="col-md-4 col-lg-2 p-0 m-0" id="reduccion">
          <AlmaCenaSidebar />
        </div>

        <div className="col-md-8 col-lg-10" id="reduccion-uno">
          <div className="gris">
            <div className="row boton-categories">
              <div className="col-sm-12 col-md-6">
                <p>
                  Categories: <span>All</span>
                </p>
              </div>
              <div className="col-sm-12 col-md-6">
                <CreateProductButton onProductCreated={handleProductCreated} />
              </div>
            </div>

            <div className="myproducts bg-white">
              <div className="row g-4 row-cols-md-2 row-cols-lg-3 row-cols-1">
                {products.map((product) => (
                  <div key={product.receta_id} className="col">
                    <div className="card">
                      <img
                        src="https://res.cloudinary.com/dq5gjc26f/image/upload/v1700657792/croissant_ttac8y.png"
                        className="card-img-top"
                        alt="Product"
                      />
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{product.nombre}</h5>
                        <div className="unidades-add">
                          <p className="card-text">
                            {product.cantidad_inventario}{" "}
                            {product.unidad_medida}
                          </p>
                          <p className="card-text">
                            Alert When: {product.cantidad_inventario_minimo}
                          </p>
                          <p className="card-text">
                            Classification: {product.clasificacion}
                          </p>
                          <div className="row">
                            <div className="col-6">
                              <EditProductButton
                                product={product}
                                onProductEdited={handleProductEdited}
                              />
                            </div>
                            <div className="col-6">
                              <DeleteProductButton
                                product={product}
                                onProductDeleted={handleProductDeleted}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

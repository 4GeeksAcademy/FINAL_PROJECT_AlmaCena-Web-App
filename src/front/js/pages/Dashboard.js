import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import AlmaCenaSidebar from "../component/AlmaCenaSidebar";

const Dashboard = () => {
  const { actions, store } = useContext(Context);
  const [user, setUser] = useState({ name: "" });
  const [ingredientes, setIngredientes] = useState([]);
  const [productosFinales, setProductosFinales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
          },
        });
        if (response.status === 401) {
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error("Error fetching dashboard data");
        }
        const data = await response.json();
        setUser({ name: data.name });
        setIngredientes(data.ingredientes);
        setProductosFinales(data.productos_finales);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const token = localStorage.getItem("jwt-token");

    if (!token) {
      navigate("/login");
    }

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="container-fluid">
      {localStorage.getItem("jwt-token") ? (
        <>
          <div className="row principal-products">
            <div className="col-md-4 col-lg-2 p-0 m-0" id="reduccion">
              <AlmaCenaSidebar />
            </div>
            <div className="col-md-8 col-lg-10" id="reduccion-uno">
              <div className="gris" id="gris-dashboard">
                <h4 className="my-5 text-black text-start">
                  Welcome, {user.name}
                </h4>

                <div className="row">
                  <div className="col-md-6">
                    {ingredientes.length > 0 ? (
                      <div className="rounded mb-5 dashboard-user shadow">
                        <h5 className="p-4">
                          You are low on these ingredients:
                        </h5>
                        <ul className="list-group list-group-flush">
                          {ingredientes.map((ingrediente) => (
                            <li
                              key={ingrediente.materia_prima_id}
                              className="list-group-item dashboard-lista"
                            >
                              <div className="row">
                                <div className="col">{ingrediente.nombre}</div>
                                <div className="col">
                                  {ingrediente.cantidad_stock}{" "}
                                  {ingrediente.unidad_medida}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="card-footer dashboard-user-listado">
                          And that's all
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-success shadow" role="alert">
                        Ingredients looking good for now.
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    {productosFinales.length > 0 ? (
                      <div className="rounded mb-5 dashboard-user shadow">
                        <h5 className="p-4">You are low on these products:</h5>
                        <ul className="list-group list-group-flush">
                          {productosFinales.map((producto) => (
                            <li
                              key={producto.producto_final_id}
                              className="list-group-item dashboard-lista"
                            >
                              <div className="row">
                                <div className="col">{producto.nombre}</div>
                                <div className="col">
                                  {producto.cantidad_inventario}{" "}
                                  {producto.unidad_medida}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="card-footer dashboard-user-listado">
                          And that's all
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-success shadow" role="alert">
                        Products looking good for now.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="gris"></div>
      )}
    </div>
  );
};

export default Dashboard;

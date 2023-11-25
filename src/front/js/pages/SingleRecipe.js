import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlmaCenaSidebar from "../component/AlmaCenaSidebar";
import "../../styles/singlerecipe.css";

const SingleRecipe = () => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + `/dashboard/recipes/${recipe_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
          }
        });
        if (response.status === 401) { navigate("/login"); }
        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }

        const recipeData = await response.json();
        setRecipe(recipeData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [token, recipe_id]);

  const handleMakeRecipe = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/recipes/make", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipe_id: recipe_id
        })
      });

      if (!response.ok) {
        throw new Error("Failed to make recipe");
      }

      console.log("Recipe made successfully");
      setShowModal(true);
    } catch (error) {
      console.error(error);
      // Manejar el error
    }
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 col-lg-2 p-0 m-0" id="reduccion">
          <AlmaCenaSidebar />
        </div>
        <div className="col-md-8 col-lg-10 gris" id="reduccion-uno">
          <div className="boton-categories row">
            <div className="col-sm-12 col-md-6">
              <h3 className="titulo-single-recipe">{loading || !recipe ? "Loading..." : recipe.nombre}</h3>
            </div>
          </div>
          {loading && <div className="spinner-border" role="status"></div>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && recipe && (
            <div className="profile-user bg-white">
              <h4 className="personal">Recipe information</h4>
              <div className="foto row">
                <div className="col-sm-12 col-md-4 imgsinglerecipe" style={{ backgroundImage: `url(https://res.cloudinary.com/dq5gjc26f/image/upload/v1700657798/singlerecipe_yq1zmt.png)` }}></div>
                <div className="col-sm-12 col-md-8">
                  <div className="table-totalyield">
                    <table className="table single recipe">
                      <thead>
                        <tr>
                          <th className="threcipe">Total Yield</th>
                          <th className="threcipe">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="trsinglerecipe">
                          <td className="tdsinglerecipe">{recipe.rinde}</td>
                          <td className="tdsinglerecipe">{recipe.unidad_medida_rinde}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="table-ingredients">
                    <table className="table single recipe">
                      <thead>
                        <tr>
                          <th className="threcipe">Qty</th>
                          <th className="threcipe">Unit</th>
                          <th className="threcipe">Ingredient</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipe.ingredientes.map((ingrediente, index) => (
                          <tr key={index} className="trsinglerecipe">
                            <td className="tdsinglerecipe">{ingrediente.cantidad_necesaria}</td>
                            <td className="tdsinglerecipe">{ingrediente.unidad_medida}</td>
                            <td className="tdsinglerecipe">{ingrediente.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-5 col-sm-12">
                      <button className="btn btn-primary" onClick={handleMakeRecipe} disabled={loading || !recipe}>
                        {loading ? <div className="spinner-border spinner-border-sm" role="status"></div> : "Make Recipe"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Modal */}
              <div className="modal fade" tabIndex="-1" role="dialog" show={showModal} onHide={() => setShowModal(false)}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Recipe Made</h5>
                      <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      Your inventory and products have been updated.
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleRecipe;

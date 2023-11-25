import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlmaCenaSidebar from "../component/AlmaCenaSidebar";
import "../../styles/myproducts.css";
import CreateRecipeButton from "../component/CreateRecipeButton";
import DeleteRecipeButton from "../component/DeleteRecipeButton";

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          process.env.BACKEND_URL + "/dashboard/recipes",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 401) {
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const recipesData = await response.json();
        setRecipes(recipesData);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchRecipes();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleRecipeCreated = async () => {
    try {
      const response = await fetch(
        process.env.BACKEND_URL + "/dashboard/recipes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching updated recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching updated recipes:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row principal-recipes">
        <div className="col-md-4 col-lg-2 p-0 m-0" id="reduccion">
          <AlmaCenaSidebar />
        </div>

        <div className="col-md-8 col-lg-10" id="reduccion-uno">
          <div className="gris">
            <div className="row boton-categories">
              <div className="col-md-6">
                <p>
                  Categories: <span>All</span>{" "}
                </p>
              </div>
              <div className="col-md-6">
                <CreateRecipeButton onRecipeCreated={handleRecipeCreated} />
              </div>
            </div>
            <div className="myproducts bg-white">
              <div className="row g-4 row-cols-md-2 row-cols-lg-3 row-cols-1">
                {recipes.map((recipe) => (
                  <div key={recipe.receta_id} className="col">
                    <div className="card">
                      <img
                        src="https://res.cloudinary.com/dq5gjc26f/image/upload/v1700657797/redvelvet_xg1pkm.png"
                        className="card-img-top"
                        alt="Recipe"
                      />
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{recipe.nombre}</h5>
                        <div className="unidades-add">
                          <p className="card-text unidades-receta">
                            Total Yield: {recipe.rinde} {recipe.unidad_medida}
                          </p>
                          <button
                            className="btn btn-primary info-receta"
                            onClick={() =>
                              navigate(`/dashboard/recipes/${recipe.receta_id}`)
                            }
                          >
                            See Recipe
                          </button>
                          <DeleteRecipeButton
                            recipe={recipe}
                            onRecipeDeleted={handleRecipeCreated}
                          />
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

export default Recipes;

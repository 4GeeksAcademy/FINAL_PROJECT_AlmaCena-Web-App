import React, { useState, useEffect } from "react";

const CreateRecipeButton = ({ onRecipeCreated }) => {
  const [show, setShow] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientQuantities, setIngredientQuantities] = useState({});
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [rinde, setRinde] = useState(1);
  const [unidadMedida, setUnidadMedida] = useState("");

  const handleClose = () => {
    setShow(false);
    setSelectedIngredients([]);
    setIngredientQuantities({});
    setSelectedIngredient(null);
    setQuantity("");
    setRecipeName("");
    setRinde("");
    setUnidadMedida("");
  };

  const fetchAvailableIngredients = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/ingredients", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching ingredients");
      }

      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handleShow = () => {
    fetchAvailableIngredients();
    setShow(true);
  };

  const handleIngredientSelected = (ingredient) => {
    setSelectedIngredients((prevIngredients) => [...prevIngredients, ingredient]);
    setSelectedIngredient(null);
  };

  const handleQuantityChange = (ingredientId, quantity) => {
    setIngredientQuantities((prevQuantities) => ({
      ...prevQuantities,
      [ingredientId]: quantity,
    }));
  };

  const handleCreateRecipe = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/dashboard/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
        body: JSON.stringify({
          nombre: recipeName,
          rinde: parseInt(rinde, 10),
          unidad_medida: unidadMedida,
          ingredientes: selectedIngredients.map((ingredient) => ({
            materia_prima_id: ingredient.materia_prima_id,
            cantidad_necesaria: parseInt(ingredientQuantities[ingredient.materia_prima_id], 10),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating recipe");
      }

      const data = await response.json();

      handleClose();

      if (onRecipeCreated) {
        onRecipeCreated(data.ingredientes);
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleShow}>
        Create Recipe
      </button>

      {show && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Recipe</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="formRecipeName" className="form-label">
                      Recipe Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="formRecipeName"
                      placeholder="Enter recipe name"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formRinde" className="form-label">
                      Total Yield
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="formRinde"
                      placeholder="Quantity"
                      value={rinde}
                      onChange={(e) => setRinde(e.target.value)}
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
                      placeholder="Portions, Units, Kilos..."
                      value={unidadMedida}
                      onChange={(e) => setUnidadMedida(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formIngredients" className="form-label">
                      Ingredients
                    </label>
                    <div className="row">
                      <div className="col">
                        <div className="dropdown">
                          <button
                            className="btn btn-success dropdown-toggle"
                            type="button"
                            id="dropdown-ingredient"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {selectedIngredient ? selectedIngredient.nombre : "Select Ingredient"}
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdown-ingredient">
                            {ingredients.map((ingredient) => (
                              <li
                                key={ingredient.materia_prima_id}
                                onClick={() => setSelectedIngredient(ingredient)}
                              >
                                {ingredient.nombre}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <button
                          className="btn btn-primary crear-receta"
                          onClick={() => {
                            if (selectedIngredient && quantity) {
                              handleIngredientSelected(selectedIngredient);
                              handleQuantityChange(
                                selectedIngredient.materia_prima_id,
                                quantity
                              );
                              setSelectedIngredient(null);
                              setQuantity("");
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedIngredients.length > 0 && (
                    <div className="mb-3">
                      <label htmlFor="formSelectedIngredients" className="form-label">
                        Selected Ingredients
                      </label>
                      <ul>
                        {selectedIngredients.map((ingredient) => (
                          <li key={ingredient.materia_prima_id}>
                            {ingredient.nombre} - {ingredientQuantities[ingredient.materia_prima_id]}{' '}
                            {ingredient.unidad_medida}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateRecipe}>
                  Create Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRecipeButton;

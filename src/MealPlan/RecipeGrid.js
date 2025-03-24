import RecipeItem from "./RecipeItem";
import "./RecipeGrid.css";

function RecipeGrid({items}){
    console.log('items type :', typeof items);
    console.log('items', items);
    return (
      <div className="RecipeGridContainer">
        {Array.isArray(items) && items.map(item => ( 
          <RecipeItem key={item.id} item={item} />
        ))}
      </div>
    )
  }
  
  export default RecipeGrid;
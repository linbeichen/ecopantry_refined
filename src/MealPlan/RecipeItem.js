//import { Link } from "react-router-dom";
import { useState } from "react";
import "./RecipeItem.css";
import Modal from "./Modal";

function RecipeItem({item}){
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const recipeName = item.title;
  const ingredients = item.ingredients.join(', ');
  const missingIngredients = item.missing_ingredients.join(', ');
  const urlToImage = item.image_url;
  const usedIngredients = item.used_ingredients.join(', ');
  const instructions = item.instructions;
  
  
  console.log('id', item.id);
  console.log('item', item);
  console.log('instructions type', typeof instructions);

// 处理 instructions 字符串
  const processInstructions = (instructions) => {
    if (!instructions || typeof instructions !== 'string') {
      return [];
    }
    // 检查是否包含 HTML 标签
    if (instructions.includes('<ol>') || instructions.includes('<li>')) {
      // 去除所有 HTML 标签
      const strippedInstructions = instructions.replace(/<[^>]+>/g, '');
      // 去除每句首尾的换行符
      const cleanedInstructions = strippedInstructions.replace(/^\s+|\s+$/g, '');
      // 检查是否包含换行符
      if (cleanedInstructions.includes('\n')) {
        // 将每句分割成数组
        return cleanedInstructions.split('\n');
      } else {
        // 如果没有换行符，返回包含单个元素的数组
        return cleanedInstructions.split('.');
      }
    } else {
      // 去除每句首尾的换行符
      const cleanedInstructions = instructions.replace(/^\s+|\s+$/g, '');
      // 检查是否包含换行符
      if (cleanedInstructions.includes('\n')) {
        // 将每句分割成数组
        return cleanedInstructions.split('\n');
      } else {
        // 如果没有换行符，返回包含单个元素的数组
        return cleanedInstructions.split('.');
      }
    }
  };

  const instructionList = processInstructions(instructions).filter(instruction => instruction.trim() !== '');


  return (
    <>
      <div className="RecipeItem" onClick={() => setIsPopupOpen(!isPopupOpen)}>
        <div className="RecipeImage">
          <img src={urlToImage} alt="recipe image" />        
        </div>
        <div className="RecipeName">
          <h2>{recipeName}</h2>
          <h4>Ingredients</h4>
          <span>{ingredients}</span>
          <h4>Used Ingredients:</h4>
          <span>{usedIngredients}</span>
          <h4>Missing Ingredients</h4>
          <span>{missingIngredients}</span>
        </div>
      </div>
      <Modal isOpen={isPopupOpen} onClose={()=> setIsPopupOpen(!isPopupOpen)} title={recipeName} children={instructionList}/>
    </>
  )
}
  
  export default RecipeItem;
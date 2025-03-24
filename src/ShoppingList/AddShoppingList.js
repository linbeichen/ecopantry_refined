import { useEffect, useState } from "react";
import { Box, TextField, Select, MenuItem, Button } from "@mui/material";
import './AddShoppingList.css';

function AddShoppingList({addShoppingListItem, selectedPreferredItem}){
  const [itemName, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  //const [quantityValue, setQuantityValue] = useState('');
  //const [unit, setUnit] = useState('');
  
  //const units = ['', 'ea', 'g', 'kg', 'l', 'mg', 'ml', 'pack', 'xg', 'xml'];
/*
  useEffect (() => {
    const currentQuantity = quantityValue + unit;
    setQuantity(currentQuantity);
  },[quantityValue,unit]);
*/

  useEffect (()=> {
    if (selectedPreferredItem){
      setName(selectedPreferredItem);
    }
  },[selectedPreferredItem]);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    const item = {
      itemName,
      quantity,
      gotIt: false
    }
    addShoppingListItem(item);

    setName('');
    setQuantity('');
  }
  return (
    <Box
      component="form"
      onSubmit={handleSubmitForm}
      className="add-shopping-list-form"
    >
      <TextField
        label="item name"
        value={itemName}
        onChange={(e) => setName(e.target.value)}
        required
        variant="outlined"
        size="small"
        className="item-name-input"
      />

      <Box className="quantity-input-box">
        <TextField
          type="number"
          label="quantity"
          value={quantity}
          //onChange={(e) => setQuantityValue(e.target.value)}
          onChange={(e)=> setQuantity(e.target.value)}
          required
          variant="outlined"
          size="small"
          className="quantity-input"
        />
        {/*<Select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
          size="small"
          className="unit-select"
        >
          {units.map((item, index) => (
            <MenuItem key={index} value={item}>{item}</MenuItem>
          ))}
        </Select>*/}
      </Box>
      <Button type="submit" variant="contained" style={{ backgroundColor: '#8e44ad' }} className="add-item-button">
        Add Item
      </Button>
    </Box>
  )
};

export default AddShoppingList;
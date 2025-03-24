import { useState } from "react";
import { List, ListItem, ListItemText, IconButton, TextField, Select, MenuItem } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import './RecommendedList.css';

const units = ['', 'ea', 'g', 'kg', 'l', 'mg', 'ml', 'pack', 'xg', 'xml'];

function RecommendList({ recomendationList, addItem }) {
  
  const [editIndex, setEditIndex] = useState();
  const [editedItem, setEditedItem] = useState(""); 
  const [quantity, setQuantity] = useState("");
//  const [quantityValue, setQuantityValue] = useState('');
//  const [unit, setUnit] = useState('');

  const handleSave = () => {
    const itemName = editedItem;
//    const quantity = `${quantityValue} ${unit}`
    const item = {
      itemName,
      quantity,
//      quantityValue,
//      unit,
      gotIt: false
    }

    addItem(item);
    setEditIndex(null);
  }

  const handleEdit = (index, value) => {
    setEditIndex(index);
    setEditedItem(value);
  }

  return (
    <List className="recommended-list">
      {recomendationList.map((item, index) => (
        <ListItem key={index} className="list-item">
          {editIndex === index ? (
            <div className="edit-form">
              <TextField
                className="edit-input"
                type="text"
                value={editedItem}
                onChange={(e) => setEditedItem(e.target.value)}
                required
              />
              <TextField
                className="quantity-input" 
                type='number'
                value= {quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              {/*<Select
                className="unit-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              >
                {units.map((unit, idx) => (
                  <MenuItem key={idx} value={unit}>{unit}</MenuItem>
                ))}
              </Select>*/}
              <IconButton 
                className="icon-button save-icon" 
                edge="end" 
                aria-label="save" 
                onClick={handleSave}>
                <SaveIcon />
              </IconButton>
              <IconButton
                className="icon-button cancel-icon" 
                edge="end" 
                aria-label="cancel" 
                onClick={()=> setEditIndex(null)}
              >
                <CloseIcon />
              </IconButton>
            </div>
          ) : (
            <>
              <ListItemText className="item-text" primary={item} />
              <IconButton 
                className="icon-button"
                edge="end" 
                aria-label="edit" 
                onClick={() => handleEdit(index, item)}
              >
                <AddShoppingCartIcon/>
              </IconButton>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );
}

export default RecommendList;
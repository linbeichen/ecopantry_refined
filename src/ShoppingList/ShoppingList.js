import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Select, MenuItem, IconButton, TablePagination, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';

const StyledTableContainer = styled(TableContainer)({
  margin: '20px auto',
  maxWidth: 1000,
});

const StyledTable = styled(Table)({
  minWidth: 650,
});


function ShoppingList({shoppingList, updateShoppingList, onAddItem, isAddButtonActive}){

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const getRealIndex = (pageIndex) => {
    const actualIndex = page * rowsPerPage + pageIndex;
    return actualIndex;
  }

//  const units = ['', 'ea', 'g', 'kg', 'l', 'mg', 'ml', 'pack', 'xg', 'xml'];

  const handleNameChange = (index, newName) => {
    const realIndex = getRealIndex(index);
    const updatedShoppingList = [...shoppingList];
    updatedShoppingList[realIndex].itemName = newName;
    updateShoppingList(updatedShoppingList);
  };
/*
  const handleQuantityChange = (index, newQuantityValue, newUnit) => {
    const updatedShoppingList = [...shoppingList];
    if (newQuantityValue) updatedShoppingList[index].quantityValue = newQuantityValue;
    if (newUnit) updatedShoppingList[index].unit = newUnit;
    updatedShoppingList[index].quantity = updatedShoppingList[index].quantityValue + updatedShoppingList[index].unit;
    updateShoppingList(updatedShoppingList);
  };
  */
  
  const handleQuantityChange = (index, newQuantity) => {
    const realIndex = getRealIndex(index);
    const updatedShoppingList = [...shoppingList];
    if (newQuantity) updatedShoppingList[realIndex].quantity = newQuantity;
//    updatedShoppingList[index].quantity = updatedShoppingList[index].quantityValue + updatedShoppingList[index].unit;
    updateShoppingList(updatedShoppingList);
  };

  const handleDelete = (index) => {
    const realIndex = getRealIndex(index);
    const updatedShoppingList = shoppingList.filter((_, i) => i !== realIndex);
    updateShoppingList(updatedShoppingList);    
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleGotItChange = (pageIndex) => {
    const realIndex = getRealIndex(pageIndex);
    const newList = [...shoppingList];
    newList[realIndex].gotIt = !newList[realIndex].gotIt;
    updateShoppingList(newList);
  };

  return (
    <StyledTableContainer component={Paper}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>Got it</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shoppingList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">No items</TableCell>
            </TableRow>
          ) : (
            shoppingList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={item.gotIt}
                    onChange={() => handleGotItChange(index)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.itemName}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value, item.unit)}
                    variant="standard"
                    style={{ width: '60px', marginRight: '10px' }}
                  />
                  {/*<Select
                    value={item.unit}
                    onChange={(e) => handleQuantityChange(index, item.quantityValue, e.target.value)}
                    variant="standard"
                  >
                    {units.map((unit, index) => (
                      <MenuItem key={index} value={unit}>{unit}</MenuItem>
                    ))}
                  </Select>*/}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <Button
          color="primary"
          aria-label="add item"
          size='small'
          onClick={onAddItem}
        >
          {!isAddButtonActive ? <AddIcon />: <RemoveIcon/>}
        </Button>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={shoppingList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
      </div>      
    </StyledTableContainer>
  );
}

export default ShoppingList;
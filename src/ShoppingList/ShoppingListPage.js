import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import Fab from '@mui/material/Fab';
import ShoppingList from "./ShoppingList";
import AddShoppingList from "./AddShoppingList";
import Predictions from "./Predictions";
import QueryRecommendation from "./QueryRecommendation";
import RecommendList from "./RecommendList";
import './ShoppingListPage.css';


const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState(() => {
    const savedShoppingList = localStorage.getItem('shoppingList');
    return savedShoppingList ? JSON.parse(savedShoppingList) : [];
  });

  const [recomendationList, setRecommendationList] = useState([]);

  const [showAddingShoppingList, setShoppingAddingList] = useState(false);

  const [showQueryInputBox, setShowQueryInputBox] = useState(false);

  const [showRecommendations, setShowRecommedations] = useState(false); 

  const [selectedPreferredItemName, setSelectedPreferredItemName] = useState();

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));    
  },[shoppingList]);

  useEffect(()=>{
    if (selectedPreferredItemName){
      setShoppingAddingList(true);
    }
  },[selectedPreferredItemName]);

  const addShoppingListItem = (item) => {
    const currentShoppingList = [...shoppingList, item];
    setShoppingList(currentShoppingList);
    setSelectedPreferredItemName(null);
  };

  const updateShoppingList = (newList) => {
    setShoppingList(newList);
  };

  const getRecommendation = (list) => {
    setRecommendationList(list);    
  };

  const getSelectedItem = (itemName) => {
    setSelectedPreferredItemName(itemName);
  }

  useEffect (()=>{
    if (recomendationList.length > 0){
      setShowRecommedations(true);
    }
  },[recomendationList]);

  return (
    <div className="shoppinglist-page-container">
      <div className="table-list-container">
        <div className="query-container">
          <Button
            variant='contained'
            endIcon={<SearchIcon/>}
            className="search-button"          
            onClick={()=>setShowQueryInputBox(!showQueryInputBox)}
            sx={{
              height: '48px',
              width: '300px', 
              justifyContent: 'space-between',
              padding: '0 16px',
              backgroundColor: '#8c6bae', 
              color: 'white',
              '&:hover': {
                backgroundColor: '#8c6bae',
              },
            }}
          >
            {showQueryInputBox ? 'Hide Query': 'Search for items...' }
          </Button>
          { showQueryInputBox && <QueryRecommendation getRecommendation={getRecommendation} />}
          { showRecommendations && 
            <div className="recommendation-list">
              <RecommendList recomendationList={recomendationList} addItem={addShoppingListItem}/>
              <Button
                variant="contained"
                onClick={()=> setShowRecommedations(false)}
                sx={{
                  margin: '10px auto',
                  backgroundColor: '#8c6bae'
                }}
              >
                Hide Recommendations
              </Button>
            </div>
          }
        </div>
        <Predictions getSelectedItem={getSelectedItem} />
      </div>
      { showAddingShoppingList && <AddShoppingList addShoppingListItem={addShoppingListItem} selectedPreferredItem={selectedPreferredItemName} />}
      <div className="shoppinglist-table">
        <h2 style={{ textAlign: 'center' }}>Shopping List</h2>
        <ShoppingList 
          shoppingList={shoppingList} 
          updateShoppingList={updateShoppingList}
          onAddItem={() => setShoppingAddingList(!showAddingShoppingList)}
          isAddButtonActive={showAddingShoppingList}
        />
      </div>    
    </div>
  );
};

export default ShoppingListPage;
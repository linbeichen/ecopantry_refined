import {React, useState, useEffect} from 'react';
import sampledata from './sampleprediction.json';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Fuse from 'fuse.js';

const getLocalStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

function Predictions({getSelectedItem}) {
  const [inventory, setInventory] = useState([]);
  const [usedItems, setUsedItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [initialList, setInitialList] = useState([]);
  const [countMap, setCountMap] = useState();
  const [finalList, setFinalList] = useState([]);
  const testdata = sampledata.predictions;

  useEffect(() => {
    setInventory(getLocalStorageData('inventory'));
    setUsedItems(getLocalStorageData('usedItems'));
    setExpiredItems(getLocalStorageData('expiredItems'));
  }, []);

  useEffect(() => {
    const totalItemList = [...inventory, ...usedItems, ...expiredItems];
    const filteredList = totalItemList
      .filter(item => !['Other', 'Beverages', 'Snacks', 'Condiments'].includes(item.category))
      .map(item => ({
        name: item.name,
        category: item.category
      }));
    setInitialList(filteredList);
  }, [inventory, usedItems, expiredItems]);

  useEffect(()=>{
    console.log('inventory: ', inventory);
    console.log('usedItems: ', usedItems);
    console.log('expiredItems:', expiredItems);
    if (!(initialList && initialList.length > 0)){
      return ;
    }
    const itemCounts = {};
    const fuse = new Fuse([], {keys:['name'], threshold: 0.3});

    initialList.forEach(item => {
      if (!itemCounts[item.category]) {
        itemCounts[item.category] = {};
        fuse.setCollection([]);
      }
    
      const categoryItems = fuse.search(item.name);
      if (categoryItems.length > 0){
        const matchedItem = categoryItems[0].item;
        itemCounts[item.category][matchedItem.name] ++;
      } else {
        itemCounts[item.category][item.name] = 1;
        fuse.add(item);
      }
      setCountMap(itemCounts);
    })
  },[initialList]);

  useEffect (()=>{
    console.log('countMap type: ', typeof countMap);
    console.log('countMap: ', countMap);
    if (!countMap || Object.keys(countMap).length === 0){
      console.log('useEffect3');
      return ;
    }
    const allItems = Object.values(countMap).flatMap(categoryItems => 
      Object.entries(categoryItems).map(([name, count])=>({name, count}))
    );
    
    console.log('allItems type: ', typeof allItems);
    console.log('allItems: ', allItems);

    const sortedItems = allItems.sort((a,b)=> b.count - a.count).reduce((obj, item) => {
      obj[item.name] = item.count;
      return obj;
    },{});

    setFinalList(sortedItems);
  },[countMap]);

  useEffect(()=>{console.log('finalList: ', finalList)},[finalList]);

  const handleClick = (itemName) => {
    getSelectedItem(itemName);
  }

  return (
    <Box sx={{ 
      maxWidth: 300, 
      margin: 'auto'
    }}>
      <Accordion sx={{ backgroundColor: '#8c6bae', color: 'white', margin: 'auto' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            height: '48px',
            width: '300px',
            backgroundColor: '#8c6bae',
            color: 'white',
            borderRadius: '10px 10px 0 0',
            '& .MuiAccordionSummary-content': {
              margin: '0',
              justifyContent: 'space-between',
            },
          }}
        >
          <Typography>Items Frequency Bought</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#8c6bae', padding: 0 }}>
          <List>
            {Object.entries(finalList).slice(0, 3).map(([key, value]) => (
              <ListItem key={key} sx={{ color: 'white' }}>
                <ListItemText primary={key} sx={{ flex: '1 1 60%' }}/>
                <ListItemText primary={value}
                  sx={{ 
                    flex: '1 1 30%', 
                    textAlign: 'right', 
                    paddingRight: '10px' 
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleClick(key)}
                  sx={{
                    color: 'white',
                    backgroundColor: '#8c6bae',
                    '&:hover': {
                      backgroundColor: '#8c6bae',
                    },
                  }}
                >
                  <AddShoppingCartIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Predictions;
import { useMemo, useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import './QueryRecommendation.css';

const QueryRecommendation = ({getRecommendation}) => {
  const [inputName, setInputName] = useState('');
  const [recommendedList, setRecommendedList] = useState([]);

  const fetchRecommendedGoods = async () => {
    try {
      console.log('Sending request to API...');
      const response = await axios.get('https://similaritemstp12.onrender.com/recommendations/', {
        params: {
          product_name: inputName
        },
        headers:{
          'Content-Type': 'application/json'
        }        
      });
    
      console.log('response data type:', typeof response);
      console.log('Response:', response);
          
      // 提取列表
      setRecommendedList(response.data.similar_products);
          
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  useMemo(()=>{
    getRecommendation(recommendedList)
  },[recommendedList]);

  return(

    <div className="query-form-container">
      <TextField 
        className="query-input"
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        required  
        margin="dense"
        variant="outlined"
        size="small"
      />
      <Button           
        className="query-button"
        variant="contained" 
        onClick={fetchRecommendedGoods}
        size="medium"
      >
        Get Recommendations
      </Button>
    </div>
  )
};

export default QueryRecommendation;
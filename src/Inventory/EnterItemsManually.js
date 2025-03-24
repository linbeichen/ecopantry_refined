// src/components/EnterItemsManually.js
import React, { useState, useEffect } from 'react';
import './EnterItemsManually.css';
import Papa from 'papaparse'; // Import Papa for parsing CSV

const categories = ['','Dairy', 'Meat & Poultry', 'Seafood', 'Bread & Bakery', 'Beverages', 'Snacks', 'Condiments', 'Prepared foods', 'Breakfast', 'Fruits', 'Vegetables', 'other'];
const units = ['', 'ea', 'g', 'kg', 'l', 'mg', 'ml', 'pack', 'xg', 'xml'];

// 加载 JSON 文件
const fetchCategories = async () => {
    const response = await fetch('/Categories 1.json');
    const data = await response.json();
    return data;
};

function EnterItemsManually({ addItem, initialItem }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantityValue, setQuantityValue] = useState('');
    const [unit, setUnit] = useState('');
    // new for cost 
    const [cost, setCost] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [foodItems, setFoodItems] = useState([]);
    const [categoriesData, setCategoriesData] = useState({}); // 保存类别数据

    useEffect(() => {
        // 加载 JSON 类别数据
        fetchCategories().then((data) => {
            setCategoriesData(data);
        });

        // Fetch the CSV file from the public folder
        fetch('/FoodItemsList.csv')
            .then((response) => response.text())
            .then((csvText) => {
                // Parse the CSV data
                Papa.parse(csvText, {
                    header: true,
                    complete: (result) => {
                        setFoodItems(result.data); // Save parsed data to state
                    },
                });
            });

        // 恢复 localStorage 数据
        const savedName = localStorage.getItem('name');
        const savedCategory = localStorage.getItem('category');
        const savedQuantity = localStorage.getItem('quantity');
        const savedExpiryDate = localStorage.getItem('expiryDate');

        if (savedName) setName(savedName);
        if (savedCategory) setCategory(savedCategory);
        if (savedQuantity) {
            const [value, unit] = savedQuantity.split(' ');
            setQuantityValue(value);
            setUnit(unit);
        }
        if (savedExpiryDate) setExpiryDate(savedExpiryDate);

        // If initialItem is provided, override localStorage values
        if (initialItem) {
            setName(initialItem.name);
            setCategory(initialItem.category);
            setQuantityValue(initialItem.quantityValue);
            setUnit(initialItem.unit);
            setExpiryDate(initialItem.expiryDate);
        }
    }, [initialItem]);

    useEffect(() => {
        // Save form data to localStorage whenever a field changes
        localStorage.setItem('name', name);
        localStorage.setItem('category', category);
        localStorage.setItem('quantity', `${quantityValue} ${unit}`);
        localStorage.setItem('expiryDate', expiryDate);
    }, [name, category, quantityValue, unit, expiryDate]);

    const handleNameChange = (e) => {
        const enteredName = e.target.value;
        setName(enteredName);

        // 从类别数据中查找匹配的类别
        for (const [categoryKey, items] of Object.entries(categoriesData)) {
            if (items.some(item => item.toLowerCase() === enteredName.toLowerCase())) {
                setCategory(categoryKey);
                break;
            }
        }

        // 检查名称是否与 CSV 数据中的项目匹配
        const matchedItem = foodItems.find(
            (item) => item.Name && item.Name.toLowerCase() === enteredName.toLowerCase()
        );

        if (matchedItem) {
            const daysUntilExpiry = parseInt(matchedItem['Days Until Expiry'], 10);
            const today = new Date();
            const expiry = new Date(today.setDate(today.getDate() + daysUntilExpiry));
            const formattedExpiry = expiry.toISOString().split('T')[0]; // format as YYYY-MM-DD
            setExpiryDate(formattedExpiry);
        } else {
            setExpiryDate('');
        }
    };

    const handleAddItem = (e) => {
        e.preventDefault();

        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = Math.abs(expiry - today);
        const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const source = 'Manually';
        const item = {
            name,
            category,
            quantity: `${quantityValue} ${unit}`,
            quantityValue: parseFloat(quantityValue),
            unit: unit,
            // update for cost
            cost: cost,
            expiryDate,
            daysUntilExpiry: expiry < today ? -daysUntilExpiry : daysUntilExpiry,
            source,
            used: initialItem ? initialItem.used : false,
        };

        addItem(item);

        // Clear the form and localStorage
        setName('');
        setCategory('');
        setQuantityValue('');
        setUnit('');
        setExpiryDate('');
        localStorage.removeItem('name');
        localStorage.removeItem('category');
        localStorage.removeItem('quantity');
        localStorage.removeItem('expiryDate');
    };

    return (
        <form className="form-container" onSubmit={handleAddItem}>
            <input
                type="text"
                placeholder="Item Name"
                value={name}
                onChange={handleNameChange}
                required
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
                <option value="">Select Category</option>
                {Object.keys(categoriesData).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(e.target.value)}
                    required
                    style={{ width: '60px', marginRight: '5px' }}
                />
                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{ width: '60px' }}
                >
                    <option value="">Select Unit</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="pack">pack</option>
                    <option value="ea">ea</option>
                </select>
            </div>
            {/*update for cost*/}
            <input 
                type='number'
                placeholder='Cost(AUD)'
                value={cost}
                onChange={(e)=> setCost(e.target.value)}
                required
            />
            <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
            />
            <button type="submit">{initialItem ? 'Save Changes' : 'Add Item'}</button>
        </form>
    );
}

export default EnterItemsManually;
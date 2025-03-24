import React, { useState, useEffect } from 'react';
import './FoodInventory.css';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate 用于跳转页面
import EnterItemsManually from './EnterItemsManually';
import ImageUpload from './ImageUpload';

const categories = ['', 'Dairy', 'Meat & Poultry', 'Seafood', 'Bread & Bakery', 'Beverages', 'Snacks', 'Condiments', 'Prepared foods', 'Breakfast', 'Fruits', 'Vegetables', 'Other'];
const units = ['', 'ea', 'g', 'kg', 'l', 'mg', 'ml', 'pack', 'xg', 'xml'];

function FoodInventory() {
    const [inventory, setInventory] = useState(() => {
        const savedInventory = localStorage.getItem('inventory');
        return savedInventory ? JSON.parse(savedInventory) : [];
    });

    const [usedItems, setUsedItems] = useState(() => {
        const savedUsedItems = localStorage.getItem('usedItems');
        return savedUsedItems ? JSON.parse(savedUsedItems) : [];
    });

    const [expiredItems, setExpiredItems] = useState(() => {
        const savedExpiredItems = localStorage.getItem('expiredItems');
        return savedExpiredItems ? JSON.parse(savedExpiredItems) : [];
    });

    const [quantityUsed, setQuantityUsed] = useState({});
    const [consumeCompletely, setConsumeCompletely] = useState({});
    const [showInputForm, setShowInputForm] = useState(false);
    const [showCaptureForm, setShowCaptureForm] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [checkExpiredItems, setCheckExpiredItems] = useState(true); // 新增状态，用于控制过期检查
    const navigate = useNavigate(); // 使用 useNavigate 代替 useHistory

    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('usedItems', JSON.stringify(usedItems));
    }, [usedItems]);

    useEffect(() => {
        localStorage.setItem('expiredItems', JSON.stringify(expiredItems));
    }, [expiredItems]);

    // 检查并更新过期物品的状态，仅在 `checkExpiredItems` 为 true 时执行
    useEffect(() => {
        if (!checkExpiredItems) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expired = [];
        const updatedInventory = inventory.map(item => {
            const expiryDate = new Date(item.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

            // 如果物品过期，则将其标记为 isExpired，并将其添加到 expiredItems 中
            if (daysUntilExpiry < 0) {
                const expiredItem = {
                    ...item,
                    isExpired: true,
                    daysUntilExpiry,
                    addedOn: item.addedOn || new Date().toISOString(),
                };
                expired.push(expiredItem);
                return expiredItem;
            } else {
                return { ...item, isExpired: false };
            }
        });

        setExpiredItems(expired);
        setInventory(updatedInventory);
        setCheckExpiredItems(false); // 检查完成后，将 `checkExpiredItems` 设置为 false，避免重复检查
    }, [inventory, checkExpiredItems]);

    // 更新物品名称
    const handleNameChange = (index, newName) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].name = newName;
        updatedInventory[index].fullName = newName; // 更新 fullName 属性
        setInventory(updatedInventory);
        setCheckExpiredItems(true); // 手动修改后需要重新检查过期状态
    };

    // 更新物品类别
    const handleCategoryChange = (index, newCategory) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].category = newCategory;
        setInventory(updatedInventory);
        setCheckExpiredItems(true);
    };

    // 更新物品数量和单位
    const handleQuantityChange = (index, newQuantity, unit) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].quantityValue = newQuantity;
        updatedInventory[index].unit = unit;
        updatedInventory[index].quantity = `${newQuantity} ${unit}`;
        setInventory(updatedInventory);
        setCheckExpiredItems(true);
    };

    // 更新物品花费
    const handleCostChange = (index, newCost) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].cost = newCost;
        setInventory(updatedInventory);
        setCheckExpiredItems(true);
    }

    // 更新物品过期日期
    const handleDateChange = (index, newDate) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].expiryDate = newDate;
        setInventory(updatedInventory);
        setCheckExpiredItems(true);
    };

    // 计算物品距离过期的天数
    const calculateDaysUntilExpiry = (expiryDate) => {
        if (!expiryDate) return '';
        const today = new Date();
        const expiry = new Date(expiryDate);
        if (isNaN(expiry.getTime())) return '';
        const diffTime = expiry - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // 添加或编辑物品
    const addItem = (item) => {
        item.quantityValue = parseFloat(item.quantityValue);
        item.unit = item.unit || 'kg';
        item.cost = parseFloat(item.cost);
        item.id = item.id || Date.now().toString();
        item.addedOn = item.addedOn || new Date().toISOString(); // 设置物品被添加到表中的日期
        item.fullName = item.fullName || item.name;
        item.isExpired = false;

        if (editIndex !== null) {
            const updatedInventory = inventory.map((invItem, index) =>
                index === editIndex ? item : invItem
            );
            setInventory(updatedInventory);
            setEditIndex(null);
        } else {
            setInventory([...inventory, item]);
        }
        setShowInputForm(false);
        setCheckExpiredItems(true); // 添加物品后需要重新检查过期状态
    };

    // 删除物品时弹出确认框
    const handleDeleteItem = (index) => {
        const confirmation = window.confirm("Are you sure you want to delete this item?");
        if (confirmation) {
            const updatedInventory = inventory.filter((_, i) => i !== index);
            setInventory(updatedInventory);
            setCheckExpiredItems(true); // 删除物品后需要重新检查过期状态
        }
    };

    const handleConsume = (index) => {
        const updatedInventory = [...inventory];
        if (consumeCompletely[index]) {
            const itemToMove = updatedInventory[index];
            const today = new Date().toISOString().split("T")[0];
            const usedItem = {
                ...itemToMove,
                usedQuantity: itemToMove.quantityValue,
                usedOn: today,
                category: itemToMove.category,
                expiryDate: itemToMove.expiryDate,
            };
            updatedInventory.splice(index, 1);
            setInventory(updatedInventory);
            setUsedItems([...usedItems, usedItem]);
            setCheckExpiredItems(true); // 消耗物品后需要重新检查过期状态
        } else {
            const usedQuantity = quantityUsed[index] ? parseFloat(quantityUsed[index]) : 0;
            const remainingQuantity = updatedInventory[index].quantityValue - usedQuantity;

            if (usedQuantity > 0 && remainingQuantity >= 0) {
                const today = new Date().toISOString().split("T")[0];
                updatedInventory[index].quantityValue = remainingQuantity;
                setInventory(updatedInventory);

                const usedItem = {
                    ...updatedInventory[index],
                    usedQuantity,
                    usedOn: today,
                    category: updatedInventory[index].category,
                    expiryDate: updatedInventory[index].expiryDate,
                };
                setUsedItems([...usedItems, usedItem]);
                setQuantityUsed(prev => ({ ...prev, [index]: '' }));
                setCheckExpiredItems(true); // 更新数量后需要重新检查过期状态
            } else {
                alert('Consumed quantity cannot exceed available quantity.');
            }
        }
        setConsumeCompletely(prev => ({ ...prev, [index]: false }));
    };

    // 跳转到 mealplan 页面
    const handlePlanMeal = () => {
        navigate('/mealplan');
    };

    return (
        <div className="food-inventory">
            <h1 className="title">Food Inventory</h1>
            <div className="buttons">
                <button
                    className="capture-button"
                    onClick={() => setShowCaptureForm(!showCaptureForm)}
                >
                    {showCaptureForm ? 'Hide Capture Form' : 'Capture the receipt image'}
                </button>
                <button
                    className="enter-button"
                    onClick={() => {
                        setShowInputForm(!showInputForm);
                        setCurrentItem(null);
                        setEditIndex(null);
                    }}
                >
                    {showInputForm ? 'Hide Form' : 'Enter items manually'}
                </button>
                {/* 新增 Plan your Meal 按钮，样式与 Enter Items Manually 按钮一致 */}
                <button className="enter-button" onClick={handlePlanMeal}>
                    Plan your Meal
                </button>
            </div>
            {showCaptureForm && <ImageUpload onUploadComplete={() => setInventory(JSON.parse(localStorage.getItem('inventory')) || [])} />}
            {showInputForm && (
                <EnterItemsManually
                    addItem={addItem}
                    initialItem={currentItem}
                />
            )}
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Cost</th>
                        <th>Expiry Date</th>
                        <th>Days Until Expiry</th>
                        <th>Quantity Used & Completely Used</th> {/* 合并列名 */}
                        <th>Delete Row</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.length === 0 ? (
                        <tr>
                            <td colSpan="8">No items in inventory</td>
                        </tr>
                    ) : (
                        inventory.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type='text'
                                        value={item.name}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={item.category}
                                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="number"
                                            value={item.quantityValue || ''}
                                            onChange={(e) => handleQuantityChange(index, e.target.value, item.unit)}
                                            min="0"
                                            style={{ width: '60px', marginRight: '5px' }}
                                        />
                                        <select
                                            value={item.unit}
                                            onChange={(e) => handleQuantityChange(index, item.quantityValue, e.target.value)}
                                            style={{ width: '60px' }}
                                        >
                                            {units.map((unit) => (
                                                <option key={unit} value={unit}>{unit}</option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <input 
                                        type='number'
                                        value={item.cost}
                                        onChange={(e) => handleCostChange(index, e.target.value)}
                                        required
                                    />
                                    <span>AUD</span>
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={item.expiryDate}
                                        onChange={(e) => handleDateChange(index, e.target.value)}
                                        required
                                    />
                                </td>
                                <td>{calculateDaysUntilExpiry(item.expiryDate)}</td>
                                {/* 将 Quantity Used 和 Completely Used 合并为同一列 */}
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="number"
                                            placeholder="Quantity Used"
                                            value={quantityUsed[index] || ''}
                                            onChange={(e) => setQuantityUsed(prev => ({ ...prev, [index]: e.target.value }))}
                                            style={{ width: '60px', marginRight: '5px' }}
                                            disabled={consumeCompletely[index]}
                                        />
                                        <button
                                            className="update-button"
                                            onClick={() => handleConsume(index)}
                                        >
                                            Used
                                        </button>
                                        <button
                                            className="update-button"
                                            onClick={() => setConsumeCompletely(prev => ({ ...prev, [index]: !prev[index] }))}
                                            style={{ marginLeft: '5px' }} // 调整按钮间距
                                        >
                                            {consumeCompletely[index] ? 'Undo' : 'Completely Used'}
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteItem(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default FoodInventory;

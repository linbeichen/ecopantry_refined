import React, { useState, useEffect } from 'react';
import ImpactMenu from './ImpactMenu';
import AnalyticsCharts from './AnalyticsCharts';
import ProgressChart from './ProgressChart'; // 引入新组件
import './AnalyticsPage.css'; // 引入主页面样式

// 获取本地存储中的数据
const getLocalStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

function AnalyticsPage() {
  const [inventory, setInventory] = useState([]);
  const [usedItems, setUsedItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState('quantity'); // 新增状态，用于存储当前选中的选项

  useEffect(() => {
    setInventory(getLocalStorageData('inventory'));
    setUsedItems(getLocalStorageData('usedItems'));
    setExpiredItems(getLocalStorageData('expiredItems'));
  }, []);

  // 计算总浪费量和总购买量
  const totalBought = inventory.reduce((acc, item) => acc + (item.quantityValue || 0), 0);
  const totalWasted = expiredItems.reduce((acc, item) => acc + (item.quantityValue || 0), 0);

  // 计算类别浪费量
  const categoryWaste = expiredItems.reduce((acc, item) => {
    const category = item.category || 'Unknown';
    acc[category] = (acc[category] || 0) + (item.quantityValue || 0);
    return acc;
  }, {});

  const categoryData = Object.entries(categoryWaste).map(([category, value]) => ({
    name: category,
    value,
  }));

  // 计算常见浪费的物品
  const frequentlyWastedItems = expiredItems.reduce((acc, item) => {
    const name = item.name || 'Unnamed Item';
    acc[name] = (acc[name] || 0) + (item.quantityValue || 0);
    return acc;
  }, {});

  const frequentWasteData = Object.entries(frequentlyWastedItems).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="analytics-page-container">
      <h1 className="page-title">Understanding your carbon impact!</h1>

      {/* 布局分为左侧菜单栏和右侧图表区 */}
      <div className="content-container">
        <div className="menu-container">
          <ImpactMenu onSelectOption={setSelectedOption} /> {/* 传递选项选择事件 */}
        </div>
        <div className="charts-container">
          <AnalyticsCharts
            selectedOption={selectedOption} // 传递当前选中的选项
            totalWasted={totalWasted}
            totalBought={totalBought}
            categoryData={categoryData}
            expiredItems={expiredItems} // 传递 expiredItems
          />
        </div>
      </div>
      {/* ProgressChart 放在两块组件的下方 */}
      <ProgressChart />
    </div>
  );
}

export default AnalyticsPage;

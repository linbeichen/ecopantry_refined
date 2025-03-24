import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProgressChart.css';
import moment from 'moment'; // 引入 moment.js 来处理日期格式化

function ProgressCharts() {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    // 读取 localStorage 中的 inventory 和 usedItems 数据
    const inventoryData = JSON.parse(localStorage.getItem('inventory')) || [];
    const usedItemsData = JSON.parse(localStorage.getItem('usedItems')) || [];

    // 生成过去一周的日期数组
    const generateLastWeekDates = () => {
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        dates.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
      }
      return dates;
    };

    const lastWeekDates = generateLastWeekDates();

    // 将库存和使用的物品数据映射到过去一周的日期上
    const formattedData = lastWeekDates.map((date) => {
      const itemsOnDate = inventoryData.filter((item) => moment(item.addedOn).format('YYYY-MM-DD') === date);
      const usedItemsOnDate = usedItemsData.filter((item) => moment(item.usedOn).format('YYYY-MM-DD') === date);

      // 计算每个日期的总量、已用量和剩余量，所有物品都按件数来计算
      const totalQuantity = itemsOnDate.reduce((sum, item) => sum + 1, 0); // 每个物品算作 1 件
      const totalUsed = usedItemsOnDate.reduce((sum, item) => sum + 1, 0); // 每个已使用的物品算作 1 件

      // 使用 Math.max 保证剩余量不为负值
      const remaining = Math.max(totalQuantity - totalUsed, 0);

      return {
        date, // 日期作为 x 轴的 key
        TotalQuantity: totalQuantity, // 总数量（件数）
        TotalUsed: totalUsed, // 已使用数量（件数）
        Remaining: remaining, // 剩余数量（件数）
      };
    });

    setProgressData(formattedData);
  }, []);

  return (
    <div className="progress-charts-container">
      {/* 左侧图表区域 */}
      <div className="charts-group">
        {/* 折线图 */}
        <div className="line-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* 修改网格线颜色为浅灰色 */}
              <XAxis
                dataKey="date"
                tickFormatter={(date) => moment(date).format('MM-DD')} // 格式化日期显示为 "MM-DD"
              />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dddddd' }}  // Tooltip 背景颜色和边框颜色
                itemStyle={{ color: '#333333' }}  // Tooltip 字体颜色
              />
              <Legend />
              {/* 修改折线图颜色为红色、绿色、黄色 */}
              <Line type="monotone" dataKey="TotalQuantity" stroke="#ff6384" strokeWidth={3} name="Total Quantity (Items)" />  {/* 红色 */}
              <Line type="monotone" dataKey="TotalUsed" stroke="#4bc0c0" strokeWidth={3} name="Total Used (Items)" />  {/* 绿色 */}
              <Line type="monotone" dataKey="Remaining" stroke="#ffcd56" strokeWidth={3} name="Remaining (Items)" />  {/* 黄色 */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 右侧描述框 */}
      <div className="description-box">
        <h3>Measure your progress over time</h3>
        <p>This chart helps you track the total usage and remaining quantities of items over the past week as a whole.</p>
      </div>
    </div>
  );
}

export default ProgressCharts;

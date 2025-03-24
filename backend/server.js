const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');  // 引入 path 模块

const app = express();
app.use(cors());
app.use(express.json());

// 连接到 MongoDB 数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodInventory')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 设置静态文件路径，提供前端 React 的静态文件
// 此处路径应指向相对于 backend 文件夹的 build 文件夹
app.use(express.static(path.join(__dirname, '../build')));

// 捕获所有非 API 路由，并返回 React 前端的 index.html 文件
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

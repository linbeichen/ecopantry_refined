import React from 'react';
import { Link } from 'react-router-dom'; // 引入 Link 组件
import './CallToAction.css'; // 引入CSS样式文件

function CallToAction() {
  return (
    <div className="call-to-action">
      <div className="cta-content">
        <h2>EcoPantry — Your Go-To for a Greener Kitchen!</h2>
        <p>Track your pantry, cut down on waste, and join your community's eco-friendly mission to waste less, save more, and live sustainably!</p>
      </div>
      <div className="cta-image">
        <img src={require('../images/CallToAction.png')} alt="EcoPantry" /> {/* 确保路径正确 */}
        <Link to="/inventory" className="cta-button"> {/* 使用 Link 组件添加跳转 */}
          Get Started &gt;&gt;
        </Link>
      </div>
    </div>
  );
}

export default CallToAction;

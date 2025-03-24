import React from 'react';
import { Link } from 'react-router-dom'; // 导入 Link 组件以便进行页面跳转
import './HeroSection.css';

function HeroSection() {
    return (
        <div className="hero">
            {/* 使用视频元素作为背景 */}
            <video className="background-video" autoPlay loop muted>
                {/* 这里引用 public 目录中的视频文件 */}
                <source src="/video/Video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* 文字内容替换，标题和描述文本 */}
            <div className="hero-text-container">
                <h1 className="hero-title">EcoPantry — Your Go-To for a Greener Kitchen!</h1>
                <p className="hero-description">
                    Track your pantry, cut down on waste, and join your community's eco-friendly mission to waste less, save more, and live sustainably!
                </p>
                {/* 新增按钮，用于跳转到 inventory 页面 */}
                <Link to="/inventory" className="hero-button">
                    Go to Inventory
                </Link>
            </div>
        </div>
    );
}

export default HeroSection;

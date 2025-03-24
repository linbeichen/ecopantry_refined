import React from 'react';
import './ImpactMenu.css'; // 引入样式文件
import quantityIcon from '../images/quantity.png'; // 引入 Quantity 图片文件
import co2Icon from '../images/co2.png'; // 引入 CO2 图片文件
import waterIcon from '../images/water.png'; // 引入 Water 图片文件
import costIcon from '../images/cost.png'; // 引入 Cost 图片文件

function ImpactMenu({ onSelectOption }) {
  return (
    <div className="impact-menu">
      <h2>Economic & Environmental Impact</h2>
      <p>Click below to explore!</p>
      <div className="impact-options">
        <div className="impact-option" onClick={() => onSelectOption('quantity')}>
          <span className="option-text">Quantity</span>
          <img src={quantityIcon} alt="Quantity" className="option-icon" /> {/* Quantity 图标 */}
        </div>
        <div className="impact-option" onClick={() => onSelectOption('co2')}>
          <span className="option-text">CO2</span>
          <img src={co2Icon} alt="CO2" className="option-icon" /> {/* CO2 图标 */}
        </div>
        <div className="impact-option" onClick={() => onSelectOption('cost')}>
          <span className="option-text">Cost</span>
          <img src={costIcon} alt="Cost" className="option-icon" /> {/* Cost 图标 */}
        </div>
      </div>
    </div>
  );
}

export default ImpactMenu;

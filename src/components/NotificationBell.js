// src/components/NotificationBell.js
import React, { useState, useEffect} from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './NotificationBell.css';

// 提示信息数组
const messages = [
  "🍏 Add your new items to the inventory and keep track!",
  "🛒 Got something new? Don’t forget to add it to your inventory!",
  "🍲 Add your food items now to stay organized!",
  "📅 Keep your inventory up to date – add your items today!",
  "⏳ Don’t miss out – add new items to your inventory now!",
  "🧺 Stay organized: Add your latest groceries to the inventory.",
  "🥫 New food items? Add them to your inventory to avoid waste!",
  "📦 Update your inventory by adding your new items!",
  "📝 Add items to your inventory to track and manage better!",
  "🍽️ Stay on top of your food – add those items now!",
  "🛍️ New groceries? Add them to your inventory for easy tracking!",
  "🍎 Keep everything fresh – add items as you buy them!",
  "🌱 Help reduce waste by adding your new food items today!",
  "🔔 Don’t let anything go unnoticed – update your inventory now!",
  "📋 Adding items regularly helps you stay on top of your food supply!",
  "🛒 Just got back from the store? Add your groceries to the inventory!",
  "🧮 Maintain a balanced inventory – add your items today!",
  "🚀 Stay one step ahead of food waste – add your new items!",
  "📦 Never forget what you bought – update your inventory!",
  "🍇 Organize your food easily – add items as soon as they arrive!"
];

function NotificationBell({ inventory = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [randomMessage, setRandomMessage] = useState('');
  const [sortedNotifications, setSortedNotifications] = useState({});
  const [viewedNotifications, setViewedNotifications] = useState([]);
  const [dismissedNotifications, setDismissedNotifications] = useState([]);

  // 初始化 viewed 和 dismissed 通知
  useEffect(() => {
    const storedViewed = JSON.parse(localStorage.getItem('viewedNotifications')) || [];
    const storedDismissed = JSON.parse(localStorage.getItem('dismissedNotifications')) || [];
    setViewedNotifications(storedViewed);
    setDismissedNotifications(storedDismissed);
  }, []);

  // 更新 viewed 和 dismissed 通知到 localStorage
  useEffect(() => {
    localStorage.setItem('viewedNotifications', JSON.stringify(viewedNotifications));
    localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
  }, [viewedNotifications, dismissedNotifications]);

  // 当 inventory 或 dismissedNotifications 发生变化时，重新计算通知
  useEffect(() => {
    // 今天的日期对象
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 将时间设为午夜

    // 初始化存储分
    const sortedNotifs = {};
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    inventory.forEach(item => {
      // 跳过缺少必要字段的物品
      if (!item.id || !item.expiryDate || !item.name) return;

      // 如果物品被用户关闭通知，跳过
      if (dismissedNotifications.includes(item.id)) {
        // 跳过已关闭的通知
        return;
      }

      // 创建物品过期日期的对象
      const expiryDate = new Date(item.expiryDate);
      expiryDate.setHours(0, 0, 0, 0); // 将时间设为午夜

      // 计算物品过期的时间差
      const diffTime = expiryDate - today;
      // 把时间差转换为天数
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // 根据过期天数确定分组
      let dayKey = '';
      if (diffDays < 0) {
        dayKey = 'Expired';
      } else if (diffDays === 0) {
        dayKey = 'Today';
      } else if (diffDays <= 7) {
        dayKey = dayNames[expiryDate.getDay()];
      } else {
        return;
      }

      // 如果分组不存在，创建一个空数组
      if (!sortedNotifs[dayKey]) {
        sortedNotifs[dayKey] = [];
      }

      sortedNotifs[dayKey].push({
        ...item,
        daysLeft: diffDays < 0 ? 'Expired' : diffDays === 0 ? 'Today' : `${diffDays} days`,
      });
    });

    setSortedNotifications(sortedNotifs);
  }, [inventory, dismissedNotifications]);

  // 计算所有通知的数量
  // flat() 把多维数组转换为一维数组
  const allNotifications = Object.values(sortedNotifications).flat();
  // 获取未查看的通知数量
  const notificationCount = allNotifications.filter(n => !viewedNotifications.includes(n.id)).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewNotification = (id) => {
    if (!viewedNotifications.includes(id)) {
      setViewedNotifications([...viewedNotifications, id]);
    }
  };

  const handleDismissNotification = (id) => {
    setDismissedNotifications([...dismissedNotifications, id]);
  };

  const dayOrder = ["Expired", "Today", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="notification-bell">
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notificationCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 500,
            width: '400px',
            padding: '15px',
          },
        }}
      >
        {/* 显示随机提示信息 */}
        {randomMessage && (
          <div className="notification-message">
            <span>{randomMessage}</span>
          </div>
        )}

        {/* 如果没有过期项，则显示子提示信息 */}
        {(!sortedNotifications['Expired'] || sortedNotifications['Expired'].length === 0) && (
          <div className="notification-submessage">
            <span>Items expiring in the next week</span>
          </div>
        )}

        {/* 按日期顺序显示通知 */}
        {dayOrder.map((day, index) => (
          sortedNotifications[day] && sortedNotifications[day].length > 0 && (
            <div key={index} className={`notification-section ${day === 'Expired' ? 'expired-section' : ''}`}>
              <h4>{day}</h4>
              <table className="notification-table">
                <tbody>
                  {sortedNotifications[day].map((notif) => (
                    <tr
                      key={notif.id}
                      className={`notification-item ${viewedNotifications.includes(notif.id) ? 'viewed' : ''}`}
                      onClick={() => handleViewNotification(notif.id)}
                    >
                      <td>{notif.name}</td>
                      <td>
                        <IconButton
                          className="dismiss-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismissNotification(notif.id);
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ))}

        {/* 如果没有通知 */}
        {Object.keys(sortedNotifications).length === 0 && !randomMessage && (
          <div style={{ padding: '10px', textAlign: 'center' }}>No notifications</div>
        )}
      </Menu>
    </div>
  );
}

export default NotificationBell;

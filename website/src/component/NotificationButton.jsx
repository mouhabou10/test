import React, { useState } from "react";
import { Bell } from "lucide-react";
import "./NotificationButton.css";

const NotificationButton = ({ notifications = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-container">
      <button className="notification-button" onClick={() => setOpen(!open)}>
        <Bell className="notification-icon" />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <ul>
            {notifications.length > 0 ? (
              notifications.map((note, index) => (
                <li key={index} className="notification-item">
                  {note}
                </li>
              ))
            ) : (
              <li className="notification-empty">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;

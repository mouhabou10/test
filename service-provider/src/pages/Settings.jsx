import React, { useState } from 'react';
import './AboutUs.css';
import Sidebar from '../component/sidebar.jsx';

const SettingsPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState(true);

  const handleUpdateEmail = (e) => {
    e.preventDefault();
    alert(`Email updated to: ${email}`);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    alert('Password updated!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      alert('Account deleted');
    }
  };

  return (
    <div className="settings-container">
      <Sidebar />
      <h2>Account Settings</h2>

      <form onSubmit={handleUpdateEmail}>
        <label>Change Email</label>
        <input
          type="email"
          placeholder="New Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Update Email</button>
      </form>

      <form onSubmit={handleUpdatePassword}>
        <label>Change Password</label>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>

      <div className="toggle-setting">
        <label>Enable Notifications</label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      <button className="danger-btn" onClick={handleDeleteAccount}>
        Delete My Account
      </button>
    </div>
  );
};

export default SettingsPage;

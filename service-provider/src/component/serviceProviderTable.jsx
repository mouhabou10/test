import React from 'react';
import './ServiceProviderTable.css';

const ServiceProviderTable = ({ data }) => {
  return (
    <div className="service-provider-table-container">
      <table className="service-provider-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Account Type</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Wilaya</th>
            <th>Speciality</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.type}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.wilaya}</td>
                <td>{item.speciality || '-'}</td>
                <td>
                  <button className="action-btn approve">✅ Approve</button>
                  <button className="action-btn reject">❌ Reject</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No pending account demands</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceProviderTable;

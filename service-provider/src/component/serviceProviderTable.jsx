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
            <th>Service Provider Name</th>
            <th>Email</th>
            <th>Director Job ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.accountType}</td>
                <td>{item.serviceProviderName}</td>
                <td>{item.email}</td>
                <td>{item.directorJobId}</td>
                <td>
                  <button className="action-btn">View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceProviderTable;

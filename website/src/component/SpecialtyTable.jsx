import React from 'react';
import './ResultTable.css'; // Reusing the same design style

const SpecialtyTable = ({ data }) => {
  return (
    <div className="card-container">
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Service Type</th>
              <th>Service Name</th>
              <th>Worker ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.serviceType}</td>
                  <td>{item.serviceName}</td>
                  <td>{item.workerId}</td>
                  <td>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecialtyTable;
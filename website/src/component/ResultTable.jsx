import React from 'react';
import './ResultTable.css';

const ResultTable = ({ data }) => {
  return (
    <div className="card-container">
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>File</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.patient}</td>
                  <td>{item.file}</td>
                  <td>{item.status}</td>
                  <td>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;

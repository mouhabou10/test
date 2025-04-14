import React from 'react';
import './ResultTable.css';

const WorkerTable = ({ data }) => {
  return (
    <div className="card-container">
      <div className="table-container">
        <table className="worker-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Worker</th>
              <th>Phone</th>
              <th>Title</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.worker}</td>
                  <td>{item.phone}</td>
                  <td>{item.title}</td>
                  <td>{item.email}</td>
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
    </div>
  );
};

export default WorkerTable;
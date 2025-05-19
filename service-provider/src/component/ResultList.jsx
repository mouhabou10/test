import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResultTable from './ResultTable.jsx';
import AddResultModal from './AddResultModal.jsx'; // Import the modal
import './ResultTable.css';

const ResultList = () => {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchResults = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/documents');
      const filtered = res.data.data.filter(doc => doc.type === 'Résultat');
      setResults(filtered);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="card-container">
      <button className="action-btn-add" onClick={() => setShowModal(true)}>➕ Add Result</button>
      <ResultTable data={results} />
      {showModal && (
        <AddResultModal onClose={() => setShowModal(false)} onSuccess={fetchResults} />
      )}
    </div>
  );
};

export default ResultList;

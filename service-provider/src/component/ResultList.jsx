import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResultTable from './ResultTable.jsx';
import './ResultTable.css';

const ResultList = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/documents');
        console.log('Documents:', res.data.data); // ✅ Check what you get here
        const filtered = res.data.data.filter(doc => doc.type === 'Résultat');
        console.log('Filtered Results:', filtered); // ✅ Confirm it's not empty
        setResults(filtered);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      }
    };
  
    fetchResults();
  }, []);
  
  return (
    <div className="card-container">
      <ResultTable data={results} />
    </div>
  );
};

export default ResultList;

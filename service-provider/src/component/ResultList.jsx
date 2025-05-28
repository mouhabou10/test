import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResultTable from './ResultTable.jsx';
import './ResultTable.css';
const ResultList = () => {
  const [results, setResults] = useState([]);
  const [newResult, setNewResult] = useState({
    title: '',
    type: 'Résultat',
    file: null,
    clientId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add authentication check
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      throw new Error('Please log in to continue');
    }

    const user = JSON.parse(userStr);
    if (!user?._id) {
      throw new Error('Invalid user data');
    }

    return { token, user };
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { token } = checkAuth();
        console.log('Fetching results with token:', token);

        const resultsRes = await axios.get('http://localhost:3000/api/v1/documents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const filtered = resultsRes.data.data.filter(doc => doc.type === 'Résultat');
        setResults(filtered);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        setError(error.message || 'Failed to load results');
      }
    };

    fetchResults();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Get authenticated user data
      const { token, user } = checkAuth();
      console.log('Authenticated user:', { id: user._id, token: token.slice(0, 10) + '...' });

      // Validate form
      if (!newResult.title?.trim()) {
        throw new Error('Title is required');
      }

      if (!newResult.file) {
        throw new Error('File is required');
      }

      if (!newResult.clientId?.trim()) {
        throw new Error('Client ID is required');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('title', newResult.title.trim());
      formData.append('type', 'Résultat');
      formData.append('file', newResult.file);
      formData.append('client', newResult.clientId.trim());
      formData.append('createdBy', user._id);

      // Log request data
      console.log('Sending request:', {
        title: newResult.title.trim(),
        type: 'Résultat',
        client: newResult.clientId.trim(),
        createdBy: user._id,
        fileName: newResult.file.name
      });

      // Send request
      const response = await axios.post(
        'http://localhost:3000/api/v1/documents',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Response:', response.data);

      // Update UI
      setResults(prev => [...prev, response.data.data]);
      setNewResult({ title: '', type: 'Résultat', file: null, clientId: '' });
      setSuccess('Result added successfully!');
      
      // Reset file input
      document.getElementById('file').value = '';

    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to add result'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-container">
      <h2>Results</h2>

      <form className="result-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newResult.title}
            onChange={(e) => setNewResult(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientId">Client ID:</label>
          <input
            type="text"
            id="clientId"
            name="clientId"
            value={newResult.clientId}
            onChange={(e) => setNewResult(prev => ({ ...prev, clientId: e.target.value }))}
            placeholder="Enter client ID (24 characters)"
            pattern="[0-9a-fA-F]{24}"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">File:</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={(e) => setNewResult(prev => ({ ...prev, file: e.target.files[0] }))}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Result'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <ResultTable data={results} />
    </div>
  );
};
export default ResultList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/upload", formData);
      fetchResults();  // Refresh data from DB
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get("/results");
      setResults(res.data);
    } catch (err) {
      setError("Failed to fetch results");
    }
  };

  useEffect(() => {
    fetchResults();  // Load data on mount
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📄 Document Analyzer Dashboard</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>Upload</button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      <h2 style={{ marginTop: '2rem' }}>📊 Analysis Table</h2>
      {results.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: '1rem', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Company Name</th>
              <th>Description</th>
              <th>Verdict</th>
              <th>Date</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, index) => (
              <tr key={index}>
                <td>{res["Company Name"]}</td>
                <td>{res["Description"]}</td>
                <td>{res["Verdict"]}</td>
                <td>{res["Date"]}</td>
                <td>{res["Timestamp"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

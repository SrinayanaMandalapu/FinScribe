import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("/upload", formData);
      await fetchResults();  // Refresh data from DB
      setFile(null);  // Clear file input
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
  try {
    setLoading(true);
    console.log("Fetching results...");
    const res = await axios.get("/results");
    console.log("Fetched results:", res.data);
    setResults(res.data);
  } catch (err) {
    console.error("Fetch failed:", err);
    setError("Failed to fetch results");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchResults();  // Load data on mount
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📄 Document Analyzer Dashboard</h1>

      {/* File input and Upload Button */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginRight: '1rem',
          }}
        />
        <button
          onClick={handleUpload}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Table */}
      <h2 style={{ marginTop: '2rem' }}>📊 Analysis Table</h2>
      {results.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: '1rem', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#494848', color: 'white' }}>
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
                <td>
                  <button
                    onClick={() => {
                      setModalContent(res["Description"]);
                      setIsModalOpen(true);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#008CBA',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </td>
                <td>{res["Verdict"]}</td>
                <td>{res["Date"]}</td>
                <td>{res["Timestamp"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Description */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '600px',
              maxHeight: '80%',
              overflowY: 'auto',
              textAlign: 'left',
            }}
          >
            <h3>Description</h3>
            <p>{modalContent}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');

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
      await fetchResults();
      setFile(null);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/results");
      setResults(res.data);
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Filtered results
  const filteredResults = results.filter((res) => {
    const name = res["Company Name"]?.toLowerCase() || '';
    const date = res["Date"]?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || date.includes(term);
  });

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

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

      {/* Filter Input */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by company name or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '300px',
          }}
        />
      </div>

      {/* Loading and Error */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Table */}
      <h2 style={{ marginTop: '2rem' }}>📊 Analysis Table</h2>
      {currentItems.length === 0 ? (
        <p>No data found</p>
      ) : (
        <>
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
              {currentItems.map((res, index) => (
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

          {/* Pagination Controls */}
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              style={{
                marginRight: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Prev
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
            <span style={{ marginLeft: '1rem' }}>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </>
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
      padding: '1rem', // Add padding for small screens
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        textAlign: 'left',
        boxSizing: 'border-box',
      }}
    >
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Description</h3>
      <p style={{ fontSize: '1rem', whiteSpace: 'pre-wrap' }}>{modalContent}</p>
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

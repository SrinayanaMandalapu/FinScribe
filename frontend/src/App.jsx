// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a file first");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//   const res = await axios.post("http://localhost:5000/upload", formData);

//   // Extract the JSON from the string
//       const raw = res.data.result || res.data.message || res.data.response;
//       const cleaned = raw.replace(/```json|```/g, '').trim();  // remove ```json and ```
//       const parsed = JSON.parse(cleaned); // parse to JSON

//       setMessage(parsed);
//   //setMessage(res.data.message || res.data.response || JSON.stringify(res.data));
// } catch (err) {
//   console.error(err);
//   setMessage(`Error: ${err.response?.data?.error || err.message}`);
// }

//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>Document Analyzer</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>Upload</button>
//       {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

//       {message && (
//         <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
//           <p><strong>Company Name:</strong> {message["Company Name"]}</p>
//           <p><strong>Description:</strong> {message["Description"]}</p>
//           <p><strong>Verdict:</strong> {message["Verdict"]}</p>
//           <p><strong>Date:</strong> {message["Date"]}</p>
//         </div> )}
//     </div>
//   );
// }

// export default App;


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
      await axios.post("http://localhost:5000/upload", formData);
      fetchResults();  // Refresh data from DB
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/results");
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

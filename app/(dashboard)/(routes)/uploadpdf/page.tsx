"use client"

import React, { useState } from 'react';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [pdfAnswer, setPdfAnswer] = useState('');
  const [queryAnswer, setQueryAnswer] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handlePdfSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('pdf_file', file as File);

    try {
      const uploadResponse = await fetch('http://localhost:8000/recieve-pdf', {
        method: 'POST',
        body: formData,
      });

      // if (uploadResponse.ok) {
      //   const pdfResponse = await fetch(`http://localhost:8000/ask/${question}`);
      //   const pdfData = await pdfResponse.json();
      //   setPdfAnswer(pdfData.answer); // Set the PDF answer received from the API
      // } else {
      //   console.error('Failed to upload PDF');
      // }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const handleQuerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    const encodedQuestion = encodeURIComponent(question);
    formData.append('user_question', encodedQuestion);
    try {
      const queryResponse = await fetch(`http://localhost:8000/ask/${encodedQuestion}`,{
        method: 'POST',
        body: formData,
      });
      const queryData = await queryResponse.json();
      // console.log(queryData.answer)
      setQueryAnswer(queryData.answer); // Set the query answer received from the API
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div>
      <h1>PDF and Question Uploader</h1>
      <form onSubmit={handlePdfSubmit}>
        <div>
          <label htmlFor="pdfFile">Upload PDF:</label>
          <input type="file" id="pdfFile" accept=".pdf" onChange={handleFileChange} />
        </div>
        {/* ... Other fields ... */}
        <button type="submit">Submit PDF</button>
      </form>
      {pdfAnswer && (
        <div>
          <h2>PDF Answer:</h2>
          <p>{pdfAnswer}</p>
        </div>
      )}
      <form onSubmit={handleQuerySubmit}>
        <div>
          <label htmlFor="question">Enter Question:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
        </div>
        <button type="submit">Submit Query</button>
      </form>
      {queryAnswer && (
        <div>
          <h2>Query Answer:</h2>
          <p>{queryAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default Home;

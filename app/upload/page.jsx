'use client';
 
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import React, { useReducer } from 'react';
 
export default function UploadPage() {
  const inputFileRef = useRef(null);

  const [blob, setBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);


  const handleAnalyze = async () => {
        
    //const blob="https://z8uwet03buwvrztb.public.blob.vercel-storage.com/Tennis_Racquet_Gold-e9oLawKK5HmrQqlbvs05b9WBW3fpTw.png";
    
    if (!blob) {
      setError('Please upload a file first.');
      return;
    }

    try {
    
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           blob: blob,
        }),
      
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the image');
      }

      const result = await response.text();
      setAnalysisResult(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h1>Upload Your Image</h1>
 
      <form
        onSubmit={async (event) => {
          event.preventDefault();
 
          const file = inputFileRef.current.files[0];
 
          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });
 
          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>)}
    <button onClick={handleAnalyze}>Get Fashion Suggestions</button>
    {analysisResult && (
        <div>
          <h2>Analysis Result</h2>
          <pre>{analysisResult}</pre>
        </div>
      )}

{error && (
        <div>
          <h2>Errors</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

    </>
  );
}
'use client';
 
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import React, { useReducer } from 'react';
import styles from './UploadPage.module.css';
 
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
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.analysisCard}>
     
      <h1> Reduce Waste </h1>
      <h3> Upload a Picture of Your Old Fashion Items and get suggestions on you can re-style them!  </h3>
 
    
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
        
        <button type="submit" className={styles.button}>
        Upload Image</button>
     
      </form> 
   
     {blob && (
        <div >
          <img src={blob.url} alt="Uploaded Image" className={styles.image} />
   
          <button onClick={handleAnalyze}  
          className={styles.button}>Get Fashion Suggestions</button>
    
          {analysisResult && (
            <div className={styles.analysisResult}>
              <h2>Results</h2> 
          
              <pre className={styles.normalText}><div >
              Here are some suggestions on how you can re-style this item:</div></pre>
              <ul className={styles.resultul}>
                {analysisResult.map((suggestion, index) => (
                  <li key={index}>{suggestion.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && (
        <div>
          <h2>Errors</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
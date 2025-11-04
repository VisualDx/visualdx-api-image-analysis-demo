'use client';

import { useState } from 'react';
import styles from './page.module.css';
import type { ProductInfo } from '@/types/skincare-data.types';

interface AnalysisResult {
  lesionName: string;
  lesionMessage: string;
  therapyMessage: string;
  products: ProductInfo[];
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        setError('Only .png and .jpg images smaller than 10MB are supported');
        setPreviewUrl('');
        setResult(null); // Clear previous results
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError('Only .png and .jpg images smaller than 10MB are supported');
        setPreviewUrl('');
        setResult(null); // Clear previous results
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setResult(null); // Clear previous results when new image is selected
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('This account lacks permission to analyze images');
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Only .png and .jpg images smaller than 10MB are supported');
        }
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
      
      // Clear previous results and scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('lesion-analysis');
        if (resultsElement) {
          resultsElement.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>VisualDx API - Lesion Analysis Example</h1>
      
      <p>Analyze a picture of your skin to find cosmetic product recommendations.</p>
      
      <a 
        href="https://github.com/VisualDx/visualdx-api-image-analysis-demo" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.githubLink}
      >
        Click here to see the code
      </a>

      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <div className={styles.fileInput}>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            disabled={isAnalyzing}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!selectedFile || isAnalyzing}
          className={styles.submitButton}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>

      {previewUrl && !isAnalyzing && (
        <div className={styles.preview}>
          <h3>Selected Image:</h3>
          <img src={previewUrl} alt="Preview" className={styles.previewImage} />
        </div>
      )}

      {isAnalyzing && (
        <div className={styles.spinner}>
          <div className={styles.spinnerIcon}></div>
          <p>Analyzing your image...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div id="lesion-analysis" className={styles.results}>
          {result.lesionMessage ? (
            <p>{result.lesionMessage}</p>
          ) : (
            <p>It looks like you might have <strong>{result.lesionName}</strong>.</p>
          )}
          <p>{result.therapyMessage}</p>
          
          {result.products && result.products.length > 0 && (
            <div className={styles.productsContainer}>
              <h3>Recommended Products</h3>
              <div className={styles.productsGrid}>
                {result.products.map((product) => (
                  <div key={product.productId} className={styles.productCard}>
                    <a href={product.purchaseLink} target="_blank" rel="noopener noreferrer">
                      <div className={styles.productImagePlaceholder}></div>
                      <span className={styles.productName}>{product.productName}</span>
                    </a>
                    <p className={styles.productDescription}>{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
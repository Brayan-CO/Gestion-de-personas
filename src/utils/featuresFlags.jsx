import { useState, useEffect } from 'react';

const useFeatures = () => {
  const [features, setFeatures] = useState({
    rag_enabled: false,
    loading: true
  });

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('TU_URL_API/config/features');
        if (response.ok) {
          const data = await response.json();
          setFeatures({ ...data, loading: false });
        } else {
         
          setFeatures({ rag_enabled: false, loading: false });
        }
      } catch (error) {
        console.error('Error cargando features:', error);
        setFeatures({ rag_enabled: false, loading: false });
      }
    };

    fetchFeatures();
    
   
    const interval = setInterval(fetchFeatures, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return features;
};

export default useFeatures;
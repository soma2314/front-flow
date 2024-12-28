import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const baseurl = import.meta.env.VITE_BASE_URL;

console.log(baseurl);


function AboutTeam() {
  const [error, setError] = useState(null);
  
  const fetchSomeInfo = async () => {
    try {
      console.log('Fetching from:', `${baseurl}/aboutTeam`); // Debug URL
      const response = await axios.get(`${baseurl}/aboutTeam`, {
        withCredentials: true
      });
      console.log('Response:', response.data); // Debug response
      toast.success("Fetched some info.");
      return response.data;
    } catch (error) {
      console.error("Full error:", error); // Debug full error
      setError(error.message);
      toast.error(`Failed to fetch some info: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchSomeInfo();
  }, []);

  return (
    <div className='aboutTeam'>
      <h1>Meet our team</h1>
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}

export default AboutTeam;
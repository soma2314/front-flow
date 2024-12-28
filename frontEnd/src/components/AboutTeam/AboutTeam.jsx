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
      // Remove the template literal $ since it's in the h1 text
      console.log('Fetching from:', `${baseurl}/v2/aboutTeam`);
      const response = await axios.get(`${baseurl}/v2/aboutTeam`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      toast.success("Fetched some info.");
      return response.data;
    } catch (error) {
      console.error("Full error:", error);
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
      <h1>I am calling for {baseurl}/v2/aboutTeam/</h1>
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}

export default AboutTeam;
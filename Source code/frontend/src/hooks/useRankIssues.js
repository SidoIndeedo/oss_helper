import { useState } from 'react';
import toast from 'react-hot-toast';
import { rankIssues } from '../services/api';

export const useRankIssues = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [issues, setIssues] = useState([]);

  const rank = async (payload) => {
    console.log('📤 Sending payload to backend:', payload);
    setLoading(true);
    setError(null);
    try {
      const response = await rankIssues(payload);
      console.log('📥 Response received:', response.data);
      setIssues(response.data);
      toast.success(`✨ Found ${response.data.length} issues`);
      return response.data;
    } catch (err) {
      console.error('❌ API call failed:', err);
      let errorMsg = 'Failed to rank issues';
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.request) {
        errorMsg = 'Cannot connect to backend. Is it running?';
      }
      setError(errorMsg);
      toast.error(errorMsg);
      setIssues([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, issues, rank };
};
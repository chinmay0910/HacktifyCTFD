// ChallengeDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChallengeDetailsPage = () => {
  const { id } = useParams(); // Get challenge ID from URL params
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/challenges/details/${id}`);
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error('Error fetching challenge details:', error);
      }
    };

    fetchChallenge();
  }, [id]);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 my-8 w-full">
      <h2 className="text-2xl font-bold mb-4">Challenge Details</h2>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <p><strong>ID:</strong> {challenge._id}</p>
        <p><strong>Name:</strong> {challenge.name}</p>
        <p><strong>Value:</strong> {challenge.value}</p>
        <p><strong>Category:</strong> {challenge.category}</p>
        <p><strong>Type:</strong> {challenge.type}</p>
        <p><strong>State:</strong> {challenge.state}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default ChallengeDetailsPage;

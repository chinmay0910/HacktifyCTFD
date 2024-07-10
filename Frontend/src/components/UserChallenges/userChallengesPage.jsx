


import React, { useEffect, useState } from 'react';
import PageHeader from '../navbar/PageHeader';


import ChallengeButton from '../ChallengeButtons/buttons';

import Modal from '../modal/modal';



const UserChallengePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/challenges/all'); // Ensure this URL is correct
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          setChallenges(data);
        } catch (err) {
          console.error('Error parsing JSON:', err);
          console.error('Response text:', text);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, []);

  const handleButtonClick = (challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
    setAnswer('');
  };

  const groupByCategory = (challenges) => {
    return challenges.reduce((acc, challenge) => {
      if (!acc[challenge.category]) {
        acc[challenge.category] = [];
      }
      acc[challenge.category].push(challenge);
      return acc;
    }, {});
  };

  const groupedChallenges = groupByCategory(challenges);

  return (
    <>
      <PageHeader pageTitle="Challenges" />
      <div className="container mx-auto p-4">
        {Object.keys(groupedChallenges).map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {groupedChallenges[category].map((challenge, index) => (
                <ChallengeButton
                  key={index}
                  challenge={challenge}
                  onClick={handleButtonClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedChallenge && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          challenge={selectedChallenge}
          answer={answer}
          setAnswer={setAnswer}
        />
      )}
    </>
  );
};

export default UserChallengePage;

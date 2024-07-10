// // export default UserChallengePage;
// import React, { useEffect, useState } from 'react';
// import PageHeader from '../navbar/PageHeader';
// import ChallengeButton from '../ChallengeButtons/buttons';// Make sure to adjust the path accordingly

// const UserChallengePage = () => {
//   const [challenges, setChallenges] = useState([]);

//   useEffect(() => {
//     const fetchChallenges = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/challenges/all');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const text = await response.text();
//         try {
//           const data = JSON.parse(text);
//           setChallenges(data);
//         } catch (err) {
//           console.error('Error parsing JSON:', err);
//           console.error('Response text:', text);
//         }
//       } catch (error) {
//         console.error('Error fetching challenges:', error);
//       }
//     };

//     fetchChallenges();
//   }, []);

//   return (
//     <>
//       <PageHeader pageTitle="Challenges" />
//       <div className="container mx-auto p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {challenges.map((challenge, index) => (
//             <ChallengeButton
//               key={index}
//               name={challenge.name}
//               value={challenge.value}
//               category={challenge.category}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserChallengePage;


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

  return (
    <>
      <PageHeader pageTitle="Challenges" />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => (
            <ChallengeButton
              key={index}
              challenge={challenge}
              onClick={handleButtonClick}
            />
          ))}
        </div>
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

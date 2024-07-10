// import React from 'react';
// import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

// const ChallengeButton = ({ name, value, category }) => {
//   return (
//     <div className="w-full mb-4">
//       <h2 className="text-2xl font-bold mb-4">{category}</h2>
//       <Link to={`/${name}`} className="block">
//         <button className="bg-gray-800 text-white text-lg font-semibold py-6 px-12 rounded-lg shadow-lg w-60 mx-auto hover:bg-gray-700 transition duration-300">
//           {name}
//           <div className="text-xl mt-2">{value}</div>
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default ChallengeButton;



import React from 'react';

const ChallengeButton = ({ challenge, onClick }) => {
  return (
    <div className="w-full mb-4">
      <h2 className="text-2xl font-bold mb-4">{challenge.category}</h2>
      <button
        onClick={() => onClick(challenge)}
        className="bg-gray-800 text-white text-lg font-semibold py-6 px-12 rounded-lg shadow-lg w-60 mx-auto hover:bg-gray-700 transition duration-300"
      >
        {challenge.name}
        <div className="text-xl mt-2">{challenge.value}</div>
      </button>
    </div>
  );
};

export default ChallengeButton;

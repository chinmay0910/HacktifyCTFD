import React from 'react';
import PageHeader from '../navbar/PageHeader';

const UserChallengePage = () => {
  return (
    <>
      <PageHeader pageTitle="Challenges" />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Multiple Choice</h2>
            <button className="bg-gray-800 text-white text-lg font-semibold py-6 px-12 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
              Trivia
              <div className="text-xl mt-2">42</div>
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Forensics</h2>
            <button className="bg-gray-800 text-white text-lg font-semibold py-6 px-12 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
              The Lost Park
              <div className="text-xl mt-2">50</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserChallengePage;

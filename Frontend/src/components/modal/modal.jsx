
import React from 'react';

const Modal = ({ isOpen, onClose, challenge, answer, setAnswer, handleSubmit, attempts, feedback }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mx-auto">{challenge.name}</h1>
      <button onClick={onClose} className="ml-4">&times;</button>
    </div>
    <h1 className="text-xl mr-8 mt-4 text-center">{challenge.value}</h1>
        <p className="mt-4">{challenge.description}</p>

        {challenge.type === 'multiple_choice' ? (
          <div className="mt-4">
            {challenge.choices.map((choice, index) => (
              <div key={index} className="mt-2">
                <input
                  type="radio"
                  id={`choice-${index}`}
                  name="choice"
                  value={choice}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <label htmlFor={`choice-${index}`} className="ml-2">{choice}</label>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <span>{attempts}/3 attempts</span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {feedback && <p className="mt-4 text-center">{feedback}</p>}
      </div>
    </div>
  );
};

export default Modal;


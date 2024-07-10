import React from 'react';

const Modal = ({ isOpen, onClose, challenge, answer, setAnswer }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    console.log('Answer submitted:', answer);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{challenge.name}</h2>
        <p className="mb-4">{challenge.description}</p>
        {challenge.type === 'code' && (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            rows="5"
            value={answer}
            onChange={handleChange}
          />
        )}
        {challenge.type === 'multiple_choice' && (
          <div className="mb-4">
            <label className="block mb-2">
              <input
                type="radio"
                name="answer"
                value="option1"
                onChange={handleChange}
                className="mr-2"
              />
              Option 1
            </label>
            <label className="block mb-2">
              <input
                type="radio"
                name="answer"
                value="option2"
                onChange={handleChange}
                className="mr-2"
              />
              Option 2
            </label>
            {/* Add more options as needed */}
          </div>
        )}
        {challenge.type === 'standard' && (
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            value={answer}
            onChange={handleChange}
          />
        )}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

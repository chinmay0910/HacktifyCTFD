

import React, { useState, useEffect } from 'react';
import CodeEditor from '../challenges/CodeEditor/CodeEditorFeild';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const Modal = ({
  isOpen,
  onClose,
  challenge,
  answer,
  setAnswer,
  handleSubmit,
  attempts,
  feedback
}) => {
  const [formData, setFormData] = useState({ language: 'python', flag: '' });
  const [editorOutput, setEditorOutput] = useState('');
  const [hintsModalOpen, setHintsModalOpen] = useState(false);
  const [hints, setHints] = useState([]);
  const [selectedHint, setSelectedHint] = useState(null);
  const [usedHints, setUsedHints] = useState([]); // Array to track used hints
  const [updatedValue, setUpdatedValue] = useState(challenge.value);
  const [showWarning, setShowWarning] = useState(false); // State to control showing warning
  const [showHintDetails, setShowHintDetails] = useState(false); // State to control showing hint details

  useEffect(() => {
    if (!isOpen) {
      setHintsModalOpen(false);
      setHints([]);
      setSelectedHint(null);
      setUsedHints([]);
      setUpdatedValue(challenge.value);
    }
  }, [isOpen, challenge]);

  // Fetch hints for the challenge
  const fetchHints = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/challenges/hints/${challenge._id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length > 0) {
        setHints(data[0].hints);
      } else {
        setHints([]);
      }
      setHintsModalOpen(true);
    } catch (error) {
      console.error('Error fetching hints:', error);
    }
  };

  // Fetch details of a specific hint
  const fetchHintDetails = async (hintId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/hints/hints/${hintId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.length > 0) {
        setSelectedHint(data[0]);
        setShowHintDetails(false); // Hide hint details initially
      } else {
        setSelectedHint(null);
        setShowHintDetails(false); // Hide hint details if not found
      }

      // Show warning and set selected hint if not already used
      if (!usedHints.includes(hintId)) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    } catch (error) {
      console.error('Error fetching hint details:', error);
    }
  };

  // Confirm unlocking a hint
  const confirmUnlockHint = () => {
    setShowWarning(false); // Hide warning after user confirms
    // Add the hint ID to usedHints to track that it has been used
    setUsedHints(prevHints => [...prevHints, selectedHint._id]);
    // Deduct hint cost from challenge value
    setUpdatedValue(prevValue => prevValue - selectedHint.cost);
    setShowHintDetails(true); // Show hint details after confirming
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCodeChange = (code) => {
    setFormData({ ...formData, flag: code });
  };

  const handleSubmission = () => {
    if (challenge.type === 'code') {
      setAnswer(editorOutput);
    }
    handleSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mx-auto">{challenge.name}</h2>
          <button onClick={onClose} className="ml-4">&times;</button>
        </div>
        <p className="text-xl mr-8 mt-4 text-center">Remaining Value: {updatedValue}</p>
        <div className="mt-4">
          <ReactMarkdown remarkPlugins={[gfm]} children={challenge.description} />
        </div>

        {/* Display challenge content based on type */}
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
                <label htmlFor={`choice-${index}`} className="ml-2">
                  {choice}
                </label>
              </div>
            ))}
          </div>
        ) : challenge.type === 'standard' || challenge.type === 'manual_verification' ? (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>
          </div>
        ) : challenge.type === 'code' ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="language">
                Language:
                <br />
                <small className="form-text text-gray-500">
                  Write program to record Flag
                </small>
              </label>
              <select
                id="language"
                name="language"
                className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
            </div>
            <CodeEditor
              language={formData.language}
              onCodeChange={handleCodeChange}
              setEditorOutput={setEditorOutput}
              formData={formData}
              setFormData={setFormData}
            />
          </>
        ) : null}

        {/* Display files if available */}
        {challenge.files && challenge.files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Files:</h3>
            <ul className="list-disc list-inside mt-2">
              {challenge.files.map((fileName, index) => (
                <li key={index}>
                  <a
                    href={`http://localhost:5000/uploads/${fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Button section for hints and submission */}
        <div className="mt-4 flex justify-between items-center">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700"
            onClick={fetchHints}
          >
            Hints
          </button>
          <span className="flex-grow"></span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            onClick={handleSubmission}
          >
            Submit
          </button>
        </div>

        {/* Display feedback if available */}
        {feedback && <p className="mt-4 text-center">{feedback}</p>}
        {/* Display editor output if available */}
        {editorOutput && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
            <h2 className="text-lg font-bold mb-2">Output:</h2>
            <pre className="overflow-auto">{editorOutput}</pre>
          </div>
        )}
      </div>

      {/* Modal for displaying hints */}
      {hintsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mx-auto">Hints</h2>
              <button onClick={() => setHintsModalOpen(false)} className="ml-4">&times;</button>
            </div>
            <ul className="mt-4">
              {/* Display hints list */}
              {hints.length > 0 ? (
                hints.map((hint, index) => (
                  <li key={index}>
                    {/* Button to fetch and display hint details */}
                    <button
                      onClick={() => fetchHintDetails(hint)}
                      className="text-blue-500 hover:underline"
                    >
                      Hint {index + 1}
                    </button>
                  </li>
                ))
              ) : (
                <p>No hints available</p>
              )}
            </ul>

            {/* Display hint details if selected */}
            {selectedHint && showHintDetails && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                <h3 className="text-lg font-bold">Hint Details:</h3>
                <p>{selectedHint.content}</p>
                <p>Cost: {selectedHint.cost}</p>
              </div>
            )}

            {/* Display warning before unlocking a hint */}
            {selectedHint && showWarning && !usedHints.includes(selectedHint._id) && (
              <div className="mt-4 p-4 border border-yellow-500 rounded-lg bg-yellow-100">
                <p className="text-yellow-800">Unlocking this hint will deduct {selectedHint.cost} from your score. Proceed?</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2" onClick={confirmUnlockHint}>Proceed</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowWarning(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;


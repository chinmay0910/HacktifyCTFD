import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

const Flags = ({ challengeId }) => {
  const [flags, setFlags] = useState([]);
  const [flagData, setFlagData] = useState([]);
  const [newFlag, setNewFlag] = useState('');
  const [newFlagData, setNewFlagData] = useState('case_sensitive'); // Default value
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFlag, setEditFlag] = useState('');
  const [editFlagData, setEditFlagData] = useState('case_sensitive'); // Default value
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/challenges/flags/${challengeId}`);
        const data = await response.json();
        setFlags(data.flags);
        setFlagData(data.flag_data);
      } catch (error) {
        console.error('Error fetching flags:', error);
      }
    };

    fetchFlags();
  }, [challengeId]);

  const handleAddFlag = async () => {
    if (!newFlag.trim()) {
      setMessage('Please enter a flag.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/challenges/flags/${challengeId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flag: newFlag.trim(), flag_data: newFlagData }),
      });

      if (!response.ok) {
        throw new Error('Flag addition failed.');
      }

      const data = await response.json();
      setFlags((prevFlags) => [...prevFlags, data.flag]);
      setFlagData((prevFlagData) => [...prevFlagData, newFlagData]);
      setNewFlag('');
      setMessage('Flag added successfully');
      setModalOpen(false); // Close the modal
    } catch (error) {
      setMessage('Flag addition failed.');
      console.error('Error adding flag:', error);
    }
  };

  const handleDeleteFlag = async (index) => {
    const flag = flags[index];
    try {
      const response = await fetch(`http://localhost:5000/api/challenges/flags/${challengeId}/delete/${flag}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Flag deletion failed.');
      }

      setFlags((prevFlags) => prevFlags.filter((_, i) => i !== index));
      setFlagData((prevFlagData) => prevFlagData.filter((_, i) => i !== index));
      setMessage('Flag deleted successfully');
      setEditingIndex(null); // Reset editing state if any
    } catch (error) {
      setMessage('Flag deletion failed.');
      console.error('Error deleting flag:', error);
    }
  };

  const handleEditFlag = async () => {
    if (!editFlag.trim()) {
      setMessage('Please enter a flag.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/challenges/flags/${challengeId}/edit/${editingIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flag: editFlag.trim(), flag_data: editFlagData }),
      });
  
      if (!response.ok) {
        throw new Error('Flag edit failed.');
      }
  
      const data = await response.json();
  
      // Update flags and flagData in state
      const updatedFlags = [...flags];
      updatedFlags[editingIndex] = data.flag;
      setFlags(updatedFlags);
  
      const updatedFlagData = [...flagData];
      updatedFlagData[editingIndex] = editFlagData;
      setFlagData(updatedFlagData);
  
      setMessage('Flag edited successfully');
      setEditingIndex(null); // Reset editing state
      setModalOpen(false); // Close the modal
    } catch (error) {
      setMessage('Flag edit failed.');
      console.error('Error editing flag:', error);
    }
  };
  

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditFlag(flags[index]);
    setEditFlagData(flagData[index]);
    setModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditFlag('');
    setEditFlagData('case_sensitive'); // Reset flag data to default
    setMessage('');
    setModalOpen(false); // Close the modal
  };

  const toggleModal = () => {
    handleCancelEdit()
    setModalOpen(!modalOpen);
    setMessage(''); // Clear any previous messages
    if (!modalOpen) {
      // Reset inputs when opening the modal
      setNewFlag('');
      setNewFlagData('case_sensitive');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 mx-12">
        <div className="flex flex-row items-center mb-2">
          <h3 className="font-medium text-xl">Flags</h3>
          <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer mx-2" onClick={toggleModal} title='Add Flag' />
        </div>
        {flags.length === 0 ? (
          <p>No flags added.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flag
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flag Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flags.map((flag, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <pre className="text-gray-700">{flag}</pre>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <span>{flagData[index]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <FontAwesomeIcon icon={faEdit} className="text-blue-500 cursor-pointer me-4" onClick={() => handleStartEdit(index)} />
                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" onClick={() => handleDeleteFlag(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for adding or editing flag */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{editingIndex !== null ? 'Edit Flag' : 'Add New Flag'}</h2>
            <div className="mb-4">
              <input
                type="text"
                value={editingIndex !== null ? editFlag : newFlag}
                onChange={(e) => editingIndex !== null ? setEditFlag(e.target.value) : setNewFlag(e.target.value)}
                placeholder="Enter flag"
                className="border border-gray-300 p-2 rounded-sm w-full mb-2"
              />
              <select
                id="flag_data"
                name="flag_data"
                className="form-select mt-1 block w-full sm:text-sm border border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 p-2"
                value={editingIndex !== null ? editFlagData : newFlagData}
                onChange={(e) => editingIndex !== null ? setEditFlagData(e.target.value) : setNewFlagData(e.target.value)}
              >
                <option value="case_sensitive">Case Sensitive</option>
                <option value="case_insensitive">Case Insensitive</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={toggleModal}
                className="bg-gray-600 text-white p-2 rounded-sm mr-2"
              >
                Cancel
              </button>
              <button
                onClick={editingIndex !== null ? handleEditFlag : handleAddFlag}
                className={`bg-${editingIndex !== null ? 'green' : 'blue'}-600 text-white p-2 rounded-sm`}
              >
                {editingIndex !== null ? 'Save' : 'Add Flag'}
              </button>
            </div>
            {message && <p className="mt-4">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flags;

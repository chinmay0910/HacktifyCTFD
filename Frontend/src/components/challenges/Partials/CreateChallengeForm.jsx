import React, { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ChallengeModal from './ChallengeModal'; // Adjust path as needed

const CreateChallengeForm = ({ selectedOption }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        value: '',
        language: '',
        type: selectedOption || 'standard'
    });

    const [showModal, setShowModal] = useState(false);
    const [challengeId, setChallengeId] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDescriptionChange = (value) => {
        setFormData({ ...formData, description: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Replace with your backend URL
            const url = 'http://localhost:5000/api/challenges/create'; // Replace with your actual backend endpoint

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Challenge created:', data);

            // Show modal and set challengeId
            setShowModal(true);
            setChallengeId(data.challengeId);

            // Reset form data or perform additional actions after successful creation
            setFormData({
                name: '',
                category: '',
                description: '',
                value: '',
                language: '',
                type: selectedOption || 'standard'
            });

        } catch (error) {
            console.error('Error creating challenge:', error);
            // Handle error states here, e.g., show an error message to the user
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="col-md-7 ms-8 me-24">
            <div id="create-chal-entry-div">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                        <label className="block text-gray-700">
                            Name:
                            <br />
                            <small className="form-text text-gray-500">
                                The name of your challenge
                            </small>
                        </label>
                        <input
                            type="text"
                            className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                            name="name"
                            placeholder="Enter challenge name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-700">
                            Category:
                            <br />
                            <small className="form-text text-gray-500">
                                The category of your challenge
                            </small>
                        </label>
                        <input
                            type="text"
                            className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                            name="category"
                            placeholder="Enter challenge category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-700">
                            Message:
                            <br />
                            <small className="form-text text-gray-500">
                                Use this to give a brief introduction to your challenge.
                            </small>
                        </label>
                        <SimpleMDE
                            value={formData.description}
                            onChange={handleDescriptionChange}
                        />
                    </div>

                    {selectedOption === 'code' && (
                        <div className="form-group">
                            <label className="block text-gray-700">
                                Language:
                                <br />
                                <small className="form-text text-gray-500">
                                    Select the programming language for this challenge
                                </small>
                            </label>
                            <select
                                name="language"
                                className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                                value={formData.language}
                                onChange={handleChange}
                            >
                                <option value="">Select Language</option>
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                                <option value="c++">C++</option>
                                <option value="c#">C#</option>
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="block text-gray-700">
                            Value:
                            <br />
                            <small className="form-text text-gray-500">
                                This is how many points are rewarded for solving this challenge.
                            </small>
                        </label>
                        <input
                            type="number"
                            className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                            name="value"
                            placeholder="Enter value"
                            value={formData.value}
                            onChange={handleChange}
                        />
                    </div>

                    <input type="hidden" name="state" value="hidden" />

                    <div className="form-group">
                        <button
                            className="btn btn-primary float-right bg-blue-500 text-white py-2 px-4 rounded"
                            type="submit"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
            {showModal && <ChallengeModal challengeId={challengeId} closeModal={closeModal} />}
        </div>
    );
};

export default CreateChallengeForm;

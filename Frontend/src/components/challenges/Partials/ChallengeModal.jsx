import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

const ChallengeModal = ({ challengeId, selectedOption, closeModal }) => {
    const [formData, setFormData] = useState({
        flag: '',
        flag_data: 'case_sensitive',
        file: [],
        state: 'hidden',
        language: '',
        choices: ['']
    });

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, [e.target.name]: e.target.files });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleChoiceChange = (index, event) => {
        const newChoices = formData.choices.slice();
        newChoices[index] = event.target.value;
        setFormData({ ...formData, choices: newChoices });
    };

    const addChoice = () => {
        setFormData({ ...formData, choices: [...formData.choices, ''] });
    };

    const removeChoice = (index) => {
        const newChoices = formData.choices.filter((_, i) => i !== index);
        setFormData({ ...formData, choices: newChoices });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('flag', formData.flag);
        formDataToSend.append('flag_data', formData.flag_data);
        formDataToSend.append('state', formData.state);

        if (selectedOption === 'code') {
            formDataToSend.append('language', formData.language);
        } else if (selectedOption === 'multiple_choice') {
            formDataToSend.append('choices', JSON.stringify(formData.choices));
        }

        if (formData.file.length > 0) {
            for (let i = 0; i < formData.file.length; i++) {
                formDataToSend.append('file', formData.file[i]);
            }
        }

        try {
            const response = await fetch(`http://localhost:5000/api/challenges/update/${challengeId}`, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Challenge updated successfully');
            closeModal();
        } catch (error) {
            console.error('Error updating challenge:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-dialog modal-lg w-2/3 h-2/3">
                <div className="modal-content bg-white shadow-lg rounded-lg h-full overflow-y-scroll">
                    <div className="modal-header bg-gray-100 border-b p-4 rounded-t-lg flex flex-row justify-between items-center">
                        <h5 className="modal-title text-xl font-semibold">Challenge Options</h5>
                        <button type="button" className="close text-gray-500" onClick={closeModal}>
                            <span className='text-2xl'>×</span>
                        </button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-4">
                                <label htmlFor="flag" className="block text-sm font-medium text-gray-700">
                                    Flag:
                                    <small className="text-gray-500 block">Static flag for your challenge</small>
                                </label>
                                <input
                                    id="flag"
                                    name="flag"
                                    type="text"
                                    placeholder='Enter your flag'
                                    className="form-input block w-full sm:text-sm border border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 p-2"
                                    value={formData.flag}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4 flex">
                                <div className="w-3/4 mr-2">
                                    <label htmlFor="flag_data" className="block text-sm font-medium text-gray-700">
                                        Flag Data:
                                    </label>
                                    <select
                                        id="flag_data"
                                        name="flag_data"
                                        className="form-select mt-1 block w-full sm:text-sm border border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 p-2"
                                        value={formData.flag_data}
                                        onChange={handleChange}
                                    >
                                        <option value="case_sensitive">Case Sensitive</option>
                                        <option value="case_insensitive">Case Insensitive</option>
                                    </select>
                                </div>
                                <div className="w-1/4">
                                    <input type="hidden" name="flag_type" value="static" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                    Files:
                                    <small className="text-gray-500 block">Files distributed along with your challenge</small>
                                </label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    className="form-input block w-full sm:text-sm border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0"
                                    multiple
                                    onChange={handleChange}
                                />
                                <sub className="text-muted">Attach multiple files using Control+Click or Cmd+Click</sub>
                            </div>

                            {selectedOption === 'code' && (
                                <div className="form-group mb-4">
                                    <label className="block text-gray-700" htmlFor='language'>
                                        Language:
                                        <br />
                                        <small className="form-text text-gray-500">
                                            Select the programming language for this challenge
                                        </small>
                                    </label>
                                    <select
                                        id="language"
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

                            {selectedOption === 'multiple_choice' && (
                                <div className="form-group mb-4 max-w-[100%]">
                                    <div className="flex flex-row justify-start">

                                    <label className="block text-gray-700">
                                        Choices:
                                        <br />
                                        <small className="form-text text-gray-500">
                                            Add the choices for the MCQ
                                        </small>
                                    </label>
                                    <button
                                            type="button"
                                            className="btn btn-secondary p-2"
                                            onClick={addChoice}
                                        >
                                            <FontAwesomeIcon icon={faPlusCircle} className='text-2xl'/>
                                        </button>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        {formData.choices.map((choice, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    className="form-control outline-0 w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring focus:ring-green-200"
                                                    name={`choice-${index}`}
                                                    placeholder={`Enter choice ${index + 1}`}
                                                    value={choice}
                                                    onChange={(e) => handleChoiceChange(index, e)}
                                                />
                                                {formData.choices.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger p-2"
                                                        onClick={() => removeChoice(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faMinusCircle} className="text-2xl" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        
                                    </div>
                                    <sub className="text-muted">Copy the Correct Choice to map as a Flag</sub>
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                    State:
                                    <small className="text-gray-500 block">Should the challenge be visible to users</small>
                                </label>
                                <select
                                    id="state"
                                    name="state"
                                    className="form-select mt-1 block w-full sm:text-sm border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 border p-2"
                                    value={formData.state}
                                    onChange={handleChange}
                                >
                                    <option value="visible">Visible</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>
                            <input type="hidden" id="challenge_id" name="challenge_id" value={challengeId} />
                            <div className="flex justify-end">
                                <button
                                    className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    type="submit"
                                >
                                    Finish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeModal;

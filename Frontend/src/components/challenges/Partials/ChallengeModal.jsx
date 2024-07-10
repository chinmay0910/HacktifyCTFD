import React, { useState } from 'react';

const ChallengeModal = ({ challengeId, closeModal }) => {
    const [formData, setFormData] = useState({
        flag: '',
        flag_data: 'case_sensitive',
        file: [],
        state: 'hidden'
    });

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            console.log();
            setFormData({ ...formData, [e.target.name]: e.target.files });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('flag', formData.flag);
        formDataToSend.append('flag_data', formData.flag_data);
        formDataToSend.append('state', formData.state);

        // Append each file to FormData
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
            closeModal(); // Close modal after successful update
        } catch (error) {
            console.error('Error updating challenge:', error);
            // Optionally handle error (e.g., show an error message)
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-dialog modal-lg">
                <div className="modal-content bg-white shadow-lg rounded-lg">
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

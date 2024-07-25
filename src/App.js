import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [selectedFiles, setSelectedFiles] = useState({ image1: null, image2: null });
    const [darkMode, setDarkMode] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFiles({
            ...selectedFiles,
            [e.target.name]: e.target.files[0]
        });
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image1', selectedFiles.image1);
        formData.append('image2', selectedFiles.image2);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'animation.mp4');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="App-header">
                <h1>Image Combiner</h1>
                <button onClick={toggleDarkMode} className="mode-toggle">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </header>
            <div className="file-inputs">
                <div className="file-input">
                    <label htmlFor="image1" className="custom-file-upload">
                        Upload Image 1
                    </label>
                    <input type="file" id="image1" name="image1" onChange={handleFileChange} />
                    {selectedFiles.image1 && <span>{selectedFiles.image1.name}</span>}
                </div>
                <div className="file-input">
                    <label htmlFor="image2" className="custom-file-upload">
                        Upload Image 2
                    </label>
                    <input type="file" id="image2" name="image2" onChange={handleFileChange} />
                    {selectedFiles.image2 && <span>{selectedFiles.image2.name}</span>}
                </div>
            </div>
            <button onClick={handleUpload} className="upload-button">Upload and Combine</button>
        </div>
    );
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = () => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImage1Change = (event) => {
        setImage1(event.target.files[0]);
    };

    const handleImage2Change = (event) => {
        setImage2(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!image1 || !image2) {
            alert('Please select both images.');
            return;
        }

        const formData = new FormData();
        formData.append('image1', image1);
        formData.append('image2', image2);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/upload', formData, {
                responseType: 'blob',
            });
            setLoading(false);
            const videoBlob = new Blob([response.data], { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(videoUrl);
        } catch (error) {
            setLoading(false);
            console.error('Error uploading files:', error);
        }
    };

    return (
        <div className="container">
            <h1>Image Combiner</h1>
            <input type="file" accept="image/*" onChange={handleImage1Change} />
            <input type="file" accept="image/*" onChange={handleImage2Change} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload and Combine'}
            </button>
            {videoUrl && (
                <div className="video-container">
                    <h2>Combined Video</h2>
                    <video src={videoUrl} controls />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

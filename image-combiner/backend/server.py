import os
import cv2
import numpy as np
from flask import Flask, request, send_file
from flask_cors import CORS
from moviepy.editor import ImageSequenceClip

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'image1' not in request.files or 'image2' not in request.files:
        return 'No file part', 400
    
    image1 = request.files['image1']
    image2 = request.files['image2']
    
    if image1.filename == '' or image2.filename == '':
        return 'No selected file', 400
    
    image1_path = os.path.join(UPLOAD_FOLDER, image1.filename)
    image2_path = os.path.join(UPLOAD_FOLDER, image2.filename)
    combined_image_path = os.path.join(PROCESSED_FOLDER, 'combined.jpg')
    video_path = os.path.join(PROCESSED_FOLDER, 'animation.mp4')
    
    image1.save(image1_path)
    image2.save(image2_path)
    
    combine_and_animate_images(image1_path, image2_path, combined_image_path, video_path)
    
    return send_file(video_path, mimetype='video/mp4')

def combine_and_animate_images(image1_path, image2_path, combined_image_path, video_path):
    
    img1 = cv2.imread(image1_path)
    img2 = cv2.imread(image2_path)
    
    
    height, width = img1.shape[:2]
    img2 = cv2.resize(img2, (width, height))
    
    
    combined_img = cv2.hconcat([img1, img2])
    
    
    cv2.imwrite(combined_image_path, combined_img)
    
   
    frames = []
    num_frames = 120  
    for i in range(num_frames):
        alpha = i / num_frames
        beta = 1.0 - alpha
        frame = cv2.addWeighted(img1, beta, img2, alpha, 0.0)
        frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    
    
    clip = ImageSequenceClip(frames, fps=30)
    clip.write_videofile(video_path, codec='libx264')

if __name__ == '__main__':
    app.run(debug=True, port=5000)

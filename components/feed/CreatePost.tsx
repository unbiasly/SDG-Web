"use client"
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Calendar, Image as ImageIcon, Video, SmilePlus } from 'lucide-react';

const CreatePost = () => {
  const [postText, setPostText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Create preview URLs for the selected files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (postText.trim() || selectedFiles.length > 0) {
      console.log('Post content:', postText);
      console.log('Files:', selectedFiles);
      
      // Reset form
      setPostText('');
      setSelectedFiles([]);
      setPreviewUrls(prev => {
        // Revoke all object URLs
        prev.forEach(url => URL.revokeObjectURL(url));
        return [];
      });
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white   p-4 border-b mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src="https://i.pravatar.cc/150?img=68" 
            alt="User avatar" 
            width={40} 
            height={40} 
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="flex-grow">
          <div 
            className={`${!isExpanded ? "border border-gray-300 rounded-full px-4 py-2 mb-3 w-full cursor-text" : ""}`}
            onClick={handleInputFocus}
          >
            {!isExpanded && (
              <p className="text-gray-500">Start a post</p>
            )}
          </div>
          
          {isExpanded && (
            <div className="mt-2">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="What's on your mind?"
                value={postText}
                onChange={handleInputChange}
                autoFocus
              />
              
              {previewUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      {url.includes('video') ? (
                        <video 
                          src={url} 
                          className="rounded-lg w-full h-32 object-cover" 
                          controls
                        />
                      ) : (
                        <Image 
                          src={url} 
                          alt={`Preview ${index}`} 
                          width={150} 
                          height={150}
                          className="rounded-lg w-full h-32 object-cover" 
                        />
                      )}
                      <button 
                        className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between mt-3">
                <button 
                  className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition"
                  onClick={handleSubmit}
                >
                  Post
                </button>
                <button 
                  className="text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  onClick={() => setIsExpanded(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
          <div className="flex justify-evenly text-xl mt-2 space-x-4">
              <button 
                className="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md transition"
                onClick={handlePhotoClick}
              >
                <ImageIcon size={20} className="mr-2" />
                <span>Photo</span>
              </button>
              
              <button 
                className="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md transition"
                onClick={handleVideoClick}
              >
                <Video size={20} className="mr-2" />
                <span>Video</span>
              </button>
              
              <button className="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md transition">
                <SmilePlus size={20} className="mr-2" />
                <span>GIF</span>
              </button>
            <button className="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md transition">
              <Calendar size={20} className="mr-2" />
              <span>Event</span>
            </button>
            
          </div>
      
      {/* Hidden file inputs */}
      <input 
        aria-label='image-input'
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple 
        onChange={handleFileChange}
      />
      <input 
        aria-label='video-input'
        type="file" 
        ref={videoInputRef} 
        className="hidden" 
        accept="video/*" 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CreatePost;
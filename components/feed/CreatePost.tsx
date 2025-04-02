"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  Image as ImageIcon, 
  Video, 
  SmilePlus, 
  X, 
  Globe, 
  ChevronDown, 
  MessageCircle, 
  FileIcon 
} from 'lucide-react';
import ProfileAvatar from '../profile/ProfileAvatar';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from '@/lib/redux/features/user/hooks';

const CreatePost = () => {
  // State variables
  const [postText, setPostText] = useState('');
  const { user, userLoading } = useUser();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  
  // Mock data
  const username = `@${user?.username}`;
  const avatarSrc = 'https://i.pravatar.cc/150?img=68';


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

//   const handleVideoClick = () => {
//     videoInputRef.current?.click();
//   };

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

  const handlePost = async () => {
    if (content.trim()) {
      setIsLoading(true);
      
      try {
        console.log('Post content:', content);
        const postData = new FormData();
        postData.append('content', content);
        
        // Change the field name from 'files' to 'images' to match backend expectation
        selectedFiles.forEach(file => {
          postData.append('images', file); // Changed from 'files' to 'images'
        });

        const response = await fetch('/api/createPost', {
          method: 'POST',
          body: postData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error creating post:', errorText);
          throw new Error('Failed to create post');
        }
        
        // Reset form
        setContent('');
        setSelectedFiles([]);
        setPreviewUrls(prev => {
          // Revoke all object URLs
          prev.forEach(url => URL.revokeObjectURL(url));
          return [];
        });
        
        console.log('Post created successfully');
      } catch (error) {
        console.error('Error in handlePost:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-4 border-b mb-4">
      <Dialog>
        <div className='flex w-full items-center  gap-2'>
            <ProfileAvatar 
                src='https://i.pravatar.cc/150'
                alt='User Avatar'
                size='xs'
            />
        <DialogTrigger className="w-full">
            <div className="border  border-gray-300 rounded-full px-4 py-2 flex justify-start cursor-text">
                <p className="text-gray-500">Post your Thoughts...</p>                            
            </div>
        </DialogTrigger>
        <DialogContent className='w-full'>
            <DialogHeader className="">
              <div className="flex  justify-between">
                <DialogTitle className="text-2xl font-bold">Create a post</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className=" space-y-6">
              <div className="flex items-center gap-3">
                <ProfileAvatar src={avatarSrc} alt={username} className="h-12 w-12 rounded-full" size='sm'/>
                
                <div className="flex flex-col">
                  <span className="font-semibold text-xl">{username}</span>
                  <button
                    className="flex w-fit cursor-pointer items-center gap-1 border-gray-500 border text-sm text-gray-600 hover:bg-gray-100 rounded-full px-4 py-1"
                    onClick={() => {
                        const nextVisibility = visibility === 'Public' ? 'Private' : 'Public';
                      setVisibility(nextVisibility);
                      // toast(`Visibility changed to ${nextVisibility}`);
                    }}
                  >
                    <Globe className="h-4 w-4" />
                    <span>{visibility}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    // Auto-adjust height based on content
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                      textareaRef.current.style.height = `${Math.max(180, textareaRef.current.scrollHeight)}px`;
                    }
                  }}
                  placeholder={`What's on your mind, ${username}?`}
                  className="w-full min-h-[190px] text-lg resize-none hide-scrollbar outline-none border-0 focus:ring-0"
                  data-gramm="false"
                />
              </div>
            </div>
            
            <div className="w-full justify-between items-center flex space-x-1">
                {/* More Options Div */}
              <div className="flex items-center justify-between rounded-lg border border-gray-400 px-2 p-1 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-500">Add to your post</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {[
                    // { title: "Add Video", icon: <Video className="h-5 w-5" />, onClick: selectedFiles, },
                    // { title: "Add GIF", icon: <FileIcon className="h-5 w-5" />, onClick: selectedFiles, },
                    // { title: "Add Date", icon: <Calendar className="h-5 w-5" />, onClick: selectedFiles, },
                    // { title: "Choose Audience", icon: <MessageCircle className="h-5 w-5" />, onClick: selectedFiles, isAudience: true }
                    { title: "Add Photo", icon: <ImageIcon className="h-5 w-5" />, onClick: handlePhotoClick }
                  ].map((button, index) => (
                    <button 
                      key={index}
                      className={`p-2 cursor-pointer rounded-full hover:bg-gray-100 
                        `} 
                      title={button.title} 
                      onClick={button.onClick}
                    >
                      {button.icon}
                      {/* {button.isAudience && <span className="text-sm font-medium">Anyone</span>} */}
                    </button>
                  ))}
                </div>
              </div>
              
                <button
                  className={cn(
                    'px-8 py-3 rounded-full bg-gray-300 font-bold text-black hover:bg-gray-400',
                    content.trim() 
                      ? 'cursor-pointer ' 
                      : 'cursor-not-allowed',
                    isLoading && 'opacity-75 cursor-not-allowed'
                  )}
                  onClick={handlePost}
                  disabled={!content.trim() || isLoading}
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                            <img src={url} alt={`Preview ${index}`} className="h-20 w-20 object-cover rounded" />
                            <button
                                aria-label='remove'
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                onClick={() => removeFile(index)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
              )}
        </DialogContent>
        </div>
      </Dialog>
      
      {/* <div className="flex justify-evenly text-xl mt-2 space-x-4">
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
      </div> */}
      
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
      {/* <input 
        aria-label='video-input'
        type="file" 
        ref={videoInputRef} 
        className="hidden" 
        accept="video/*" 
        onChange={handleFileChange}
      /> */}
      {/* Display selected images */}
      
    </div>
  );
};

export default CreatePost;
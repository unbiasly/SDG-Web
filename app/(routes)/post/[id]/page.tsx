'use client'
import Loading from '@/app/loading';
import { PostCard } from '@/components/feed/PostCard';
import { formatDate } from '@/lib/utilities/formatDate';
import { PostData } from '@/service/api.interface';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const { id } = useParams();
    // const searchParams = useSearchParams();
    // const isSharedPost = searchParams.get('share') === 'true';
    const [post, setPost] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getPost = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/getPosts/getPostDetails`, {
                method: 'POST',
                body: JSON.stringify({ postId: id })
            });
            
            if (!response.ok) {
                throw new Error('Post not found');
            }

            const data = await response.json();
            setPost(data.data);
            console.log(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load post');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        //  && isSharedPost
        if (id) {
            getPost();
        }
    }, [id]);

    // If it's not a shared post, redirect to the feed
    // if (!isSharedPost) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <div className="text-center">
    //                 <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Access</h1>
    //                 <p className="text-gray-600">This URL is only valid for shared posts.</p>
    //             </div>
    //         </div>
    //     );
    // }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 justify-center items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className='flex flex-1 flex-col overflow-hidden'>
            <div className="sticky top-0 bg-white z-10 flex items-center p-3 border-b border-gray-200">
                <Link href="/" aria-label='back-button' className="mr-4">
                    <ArrowLeft size={20} />
                </Link>
            </div>
            <div className="w-full mx-auto mt-8 px-4">
                <PostCard
                    _id={post._id}
                    userId={post.user_id._id}
                    name={post.user_id.name || ""}
                    handle={`@${post.user_id.username}`}
                    avatar={post.user_id.profileImage || ""}
                    time={formatDate(post.updatedAt)}
                    isLiked={post.isLiked || false}
                    content={post.content}
                    imageUrl={post.images || []}
                    likesCount={post.poststat_id?.likes || 0}
                    commentsCount={post.poststat_id?.comments || 0}
                    repostsCount={post.poststat_id?.reposts || 0}
                    isBookmarked={post.isBookmarked || false}
                    // isVerified={post.user_id.isFollowing || false}
                />
        </div>
        </div>
    );
}

export default Page;
export interface Notification {
    _id: string;
    post?: string;
    type: string;
    message: string;
    isRead: boolean;
    category: string;
    userProfile?: string;
    time?: string;
}

export interface ManualAuthRequest {
    email: string;
    password: string;
    device_id?: string;
    device_token?: string;
}
export interface ManualAuthResponse {
    message?: string;
    jwtToken?: string;
    refreshToken?: string;
    userId?: string;
    sessionId?: string;
}

export interface SocialAuthRequest {
    token: string;
    device_id?: string;
    device_token?: string;
}

export interface UserDetails {
    success: boolean;
    data?: {
        "_id": string;
        "email": string;
        "username": string;
    }
}

export interface RefreshRequest {
    "refresh_token": string;
}

export interface RefreshResponse {
    jwtToken: string;
    refreshToken: string;
}

export interface PostCreateRequest {
    "content" : string;
}

export interface PostCreateResponse {
    success: boolean;
    message: string;
    post?: {
        user_id: string;
        content: string;
        images: string[];
        status: string;
        visibility: string;
        original_post_id: string | null;
        poststat_id: string | null;
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}

export interface Experience {
    _id?: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
}

export interface Education {
    _id?: string;
    school: string;
    degree: string;
    startDate: string;
    endDate?: string;
}

export interface UserData {
    _id: string;
    username: string;
    name?: string;
    location?: string;
    gender?: string;
    experience?: Experience[];
    education?: Education[];
    dob?: Date;
    bio?: string;
    isFollowing?: boolean | null;
    portfolioLink?: string;
    profileImage?: File;
    profileBackgroundImage?: File;
    fName?: string; // Added from UserDetailsRequest
    lName?: string; // Added from UserDetailsRequest
    occupation?: string; // Added from UserDetailsRequest
    pronouns?: string; // Added from UserDetailsRequest
    headline?: string; // Added from UserDetailsRequest
}

export interface UserResponse {
    success: boolean;
    data: UserData;
}

export interface UserDetailsRequest {
    username?: string;
    name?: string;
    location?: string;
    gender?: string;
    dob?: Date;
    bio?: string;
    fName?: string;
    lName?: string;
    occupation?: string; 
    pronouns?: string; 
    headline?: string;
    portfolioLink?: string;
    profileImage?: File | string;
    profileBackgroundImage?: File | string;
    education?: Education[];
    experience?: Experience[];
}

export interface PostsFetchResponse {
    success: boolean;
    data: Post[];
    pagination: {
        limit: number;
        cursor: string;
        nextCursor: string | null;
        hasMore: boolean;
        totalItems?: number;
    };
}

export interface Post {
    _id: string;
    user_id: {
        _id: string;
        username: string;
        name?: string;
        profileImage?: string;
        followerCount: number;
        isFollowing: boolean | null;
    };
    content: string;
    images: string[];
    status?: string;
    deleted?: boolean;
    visibility: string;
    original_post_id: string | null;
    poststat_id: {
        _id?: string;
        likes: number;
        views?: number;
        bookmarks?: number;
        comments: number;
        reposts: number;
    } | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    isLiked: boolean;
    isBookmarked?: boolean;
    isReposted: boolean;
}

export interface CommentData {
    _id: string;
    user_id: {
        _id: string;
        username: string;
        profileImage?: string;
        name?: string;
    };
    comment: string;
}

export interface PostBookmarkData {
    _id: string;
    user_id: {
        _id: string;
        username: string;
        profileImage?: string;
        name?: string;
        followerCount: number;
        isFollowing: boolean | null;
    };
    content: string;
    images: string[];
    status: string;
    visibility: string;
    original_post_id: string | null;
    poststat_id: {
        _id: string;
        likes: number;
        views: number;
        bookmarks: number;
        comments: number;
        reposts: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
}

export interface SDGArticleData {
    _id: string;
    title: string;
    publisher: string;
    link: string;
    createdAt: string;
    updatedAt: string;
    isBookmarked?: boolean;
}


export interface BookmarksFetchResponse {
    success: boolean;
    data?: PostBookmarkData[] | SDGArticleData[];
    pagination?: {
        limit: number;
        cursor: string | null;
        nextCursor: string | null;
        hasMore: boolean;
    };
}

export interface CommentsFetchResponse {
    data?: CommentData[];
    pagination?: {
        limit: number;
        cursor: string | null;
        nextCursor: string | null;
        hasMore: boolean;
    };
}

export interface SDGVideoData {
    _id: string;
    title: string;
    thumbnail_url: string;
    video_id: string;
    link: string;
    published_date: string;
    channel_name: string;
    description?: string;
    status: string;
    type: string;
    goal_id?: Array<{
        _id: string;
        name: string;
    }>;
    createdAt: string;
    updatedAt: string;
    comments?: number;
    likes?: number;
    views?: number;
    isBookmarked?: boolean;
    isLiked?: boolean;
}

export interface SDGVideoDetails{
    _id: string;
    title: string;
    thumbnail_url: string;
    video_id: string;
    link: string;
    published_date: string;
    channel_name: string;
    status: string;
    type: string;
    goal_id: string[];
    createdAt: string;
    updatedAt: string;
    description: string;
    comments: CommentData[];
    likes: number;
    views: number;
    isBookmarked: boolean;
    isLiked: boolean;
}


export interface SDGVideoResponse {
    success: boolean;
    data: SDGVideoData[];
    pagination: {
        limit: number;
        cursor: string | null;
        nextCursor: string | null;
        hasMore: boolean;
        totalItems?: number;
    };
}


export interface AnalyticsResponseData {
  success: boolean;
  message: string;
  data: {
    analytics: {
      total_post_impressions: number;
      total_unique_post_impressions: number;
      total_views: number;
      unique_profiles: number;
    };
    followCounts: {
      followerCount: number;
      followingCount: number;
    };
  };
  total_views?: number; // For backward compatibility
}

export interface AnalyticsData {
  _id: string;
  userId: string;
  startDate: string;
  endDate: string;
  views: number;
}


export interface SchemeAnalyticsResponse {
    success: boolean;
    data: {
        stateWise: SchemeCardProps[];
        categoryWise: SchemeCardProps[];
        ministryWise: SchemeCardProps[];
    };
}

export interface SchemeCardProps {
    label: string;
    count: number;
    icon: string;
    type: string;
    // onClick?: () => void;
};
export interface AnalyticsResponseData {
  success: boolean;
  message: string;
  data: {
    analytics: {
      total_post_impressions: number;
      total_unique_post_impressions: number;
      total_views: number;
      unique_profiles: number;
    };
    followCounts: {
      followerCount: number;
      followingCount: number;
    };
  };
  total_views?: number; // For backward compatibility
}

export interface AnalyticsData {
  _id: string;
  userId: string;
  startDate: string;
  endDate: string;
  views: number;
}
export interface SearchResultResponse {
    success: boolean;
    data: {
        news?: any[]; // Add type definition if you have a specific structure
        users?: {
            _id: string;
            username: string;
            name?: string;
            profileImage?: string;
            followerCount?: number;
            isFollowing?: boolean | null;
        }[];
        video?: SDGVideoData[];
        posts?: Post[];
    };
    pagination?: {
        page: number;
        limit: number;
        type: string;
    };
}

export interface SessionsResponse {
    success: boolean;
    data: {
        currentSession: {
            _id: string;
            userId: string; 
            deviceId?: string;
            ipAddress: string;
            userAgent: string;
            loginTime: string;
        };
        otherSessions: {
            _id: string;
            userId: string;
            deviceId?: string;
            deviceName?: string;
            ipAddress: string;
            userAgent: string;
            loginTime: string;
        }[];
    }
}


export interface JobListing {
    _id?: string;
    title: string;
    companyName: string;
    companyLogo?: string;
    location: string;
    jobType: string;
    salaryRange?: string;
    experienceLevel: string;
    description: string;
    applyUrl: string;
    postedBy?: string; 
    expiresAt: string;
    skills?: string[];
    tags?: string[];
    isActive?: boolean;
    applicants?: number;
    screeningQuestions: ScreeningQuestion[];
    postedAt?: string;
    __v?: number;
    isSaved?: boolean;
    isApplied?: boolean;
}

export interface ScreeningQuestion {
    question?: string;
    type?: 'numeric' | 'yes/no';
    _id?: string;
}

export interface QuestionAnswer {
    question: string;
    answer: string | number;
}
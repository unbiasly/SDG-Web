export interface Notification {
    id: string;
    type: string;
    title: string;
    time: string;
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
    _id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
}

export interface Education {
    _id: string;
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
    email: string;
    gender?: string;
    experience?: Experience[];
    education?: Education[];
    dob?: Date;
    bio?: string;
    portfolioLink?: string;
    profileImage?: File;
    profileBackgroundImage?: File;
}

export interface UserResponse {
    success: boolean;
    data: UserData;
}

export interface UserDetailsRequest {
    username?: string;
    name?: string;
    location?: string;
    email?: string;
    gender?: string;
    dob?: Date;
    bio?: string;
    portfolioLink?: string;
    profileImage?: File;
    profileBackgroundImage?: File;
    education?: Education[];
    experience?: Experience[];
}

export interface PostsFetchResponse {
    success: boolean;
    data?: PostData[];
    pagination?: {
        limit: number;
        cursor: string | null;
        nextCursor: string | null;
        hasMore: boolean;
    };
}

export interface PostData {
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
    deleted?: boolean;
    visibility: string;
    poststat_id: {
        _id: string;
        likes: number;
        views: number;
        bookmarks: number;
        comments: number;
        reposts: number;
    } | null;
    original_post_id?: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    isLiked: boolean;
    isBookmarked?: boolean;
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

export interface CommentsFetchResponse {
    success: boolean;
    data?: CommentData[];
    pagination?: {
        limit: number;
        cursor: string | null;
        nextCursor: string | null;
        hasMore: boolean;
    };
}
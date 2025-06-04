import { Notification } from "@/service/api.interface";

// Base tabs for desktop (we'll keep it minimal for desktop)
export const FEED_TABS = [
    "For You",
];

// Mobile-specific tabs (showing more options on mobile)
export const MOBILE_FEED_TABS = [
    "For You",
    "The SDG News"
];
export const NOTIFICATION_TABS = [
    "Posts", // - post
    //"Job Alerts", // - job
    //"SDG Talks", // - sdg-video
    //"SDG News", // - sdg-news
    // "The SDG Event",
];

export const SCHEME_TABS = [
    "Categories",
    "State/UTs",
    "Central Ministeries",
];

export const VIDEO_TABS = ["The SDG Talks", "The SDG Podcast"];

export const PROFILE_TABS = [
    { id: "about", label: "About" },
    { id: "posts", label: "Posts" },
];

export const BOOKMARKS_TABS = [
    "All",
    "Posts",
    "News",
    "Videos",
    // "Jobs",
    // "Schemes"
];

export const SEARCH_RESULT_CATEGORIES = [
    { id: "all", label: "All" },
    { id: "people", label: "People" },
    { id: "posts", label: "Posts" },
    { id: "news", label: "News" },
    { id: "videos", label: "Videos" },
    // {id: "ministries", label: "Ministries"},
    // {id: "company", label: "Company"},
    // {id: "society", label: "Society"},
    // {id: "podcast", label: "Podcast"}
];

export const JOB_TABS = [
        { id: "preferences", label: "Preferences" },
        { id: "applied", label: "Applied Jobs" },
        { id: "saved", label: "Saved Jobs" },
    ];

export const PROFILE_OPTIONS = [
    {
        icon: "/icons/house.svg",
        label: "Home",
        route: "/",
    },
    {
        icon: "/icons/circle-user-round.svg",
        label: "Profile",
        routeGenerator: (userId: string) => `/profile/${userId}`,
    },
    { route: "/bookmarks", label: "Bookmarks", icon: "/icons/bookmark.svg" },
    { route: "/goals", label: "The 17 Goals", icon: "/icons/Target.svg" },
    { route: "/videos", label: "Videos", icon: "/icons/tv-minimal-play.svg" },
    // {route: "/society", label: "The SDG Society", icon: "/icons/society.png"},
    // {route: "/mentorship", label: "Mentorship", icon: "/icons/leadership-development.png"},
    {route: "/internship", label: "Internship", icon: "/icons/id-card.svg"},
    {route: "/jobs", label: "Job", icon: "/icons/briefcase-business.svg"},
    {
        route: "/scheme",
        label: "Scheme Search",
        icon: "/icons/Scheme.svg",
    },
    {route: "/notifications", label: "Notifications", icon: "/icons/bell-ring.svg"},
    { route: "/settings", label: "Settings", icon: "/icons/settings.svg" },
];


export const PROFILE_ANALYTICS = [
    {
        type: "views",
        description: "Update your profile to attracts viewers.",
        total_views: 100,
    },
    {
        type: "impressions",
        count: 0,
        description: "Check out who's engaging with your posts.",
    },
];

export const SDG_NEWS = [
    // { id: "trending", title: "Trending News" },
    // { id: "top", title: "Top News" },
    // { id: "breaking", title: "Breaking News" },
    { id: "sdg", title: "SDG News" },
];

export const FEEDBACK_OPTIONS = [
    "I'm not interested in the author",
    "I'm not interested in this topic",
    "I've seen too many posts on this topic",
    "I've seen this post before",
    "This post is old",
    "It's something else",
];

export const POLICY_OPTIONS = [
    "Harassment",
    "Fraud or scam",
    "Spam",
    "Misinformation",
    "Hateful Speech",
    "Threats or violence",
    "Self-harm",
    "Graphic content",
    "Dangerous or extremist organization",
    "Sexual content",
    "Fake account",
    "Child exploitation",
    "Illegal goods and services",
    "Infringement",
];

export const SCHEME_CATEGORIES = ["All Schemes", "Central Schemes"];

export const SCHEME_DATA_TABS = [
    "Details",
    "Benefits",
    "Eligibility",
    "Application Process",
];

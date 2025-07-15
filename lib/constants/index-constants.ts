// Base tabs for desktop (we'll keep it minimal for desktop)
export const FEED_TABS = ["For You"];

// Mobile-specific tabs (showing more options on mobile)
export const MOBILE_FEED_TABS = ["For You", "The SDG News"];

export const NOTIFICATION_TABS = [
    "Posts", // - post
    //"Job Alerts", // - job
    //"SDG Talks", // - sdg-video
    //"SDG News", // - sdg-news
    // "The SDG Event",
];

export const SCHEME_TABS = ["Categories", "State/UTs", "Central Ministeries"];

export const VIDEO_TABS = ["The SDG Talks", "The SDG Podcast"];

export const SDG_SOCIETY_TABS = ["Feed", "Updates"];

export const USER_PROFILE_TABS = [
    { id: "about", label: "About" },
    { id: "posts", label: "Posts" },
];

export const SOCIETY_PROFILE_TABS = [
    { id: "about", label: "About" },
    { id: "posts", label: "Posts" },
    { id: "events", label: "Events" },
];

export const SOCIETY_ADMIN_PROFILE_TABS = [
    { id: "about", label: "About" },
    { id: "posts", label: "Posts" },
    { id: "events", label: "Events" },
    { id: "members", label: "Members" },
    { id: "requests", label: "Requests" },
];

export const REPORT_TABS = ["All", "UNDP", "NITI Aayog", "State", "Ministry"];

export const BOOKMARKS_TABS = ["All", "Posts", "News", "Videos", "Jobs"];

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

export const MENTOR_PROFILE_TABS = [
    'Book a slot',
    'Student\'s Testimonials',
]

export const PROFILE_OPTIONS = [
    { icon: "/icons/house.svg", label: "Home", route: "/" },
    {
        icon: "/icons/Profile.svg",
        label: "Profile",
        routeGenerator: (userId: string) => `/profile/${userId}`,
    },
    { route: "/bookmarks", label: "Bookmarks", icon: "/icons/Bookmarks.svg" },
    { route: "/goals", label: "The 17 Goals", icon: "/icons/Target.svg" },
    { route: "/videos", label: "Videos", icon: "/icons/Videos.svg" },
    { route: "/society", label: "The SDG Society", icon: "/icons/society.png" },
    {
        route: "/mentorship",
        label: "Mentorship",
        icon: "/icons/leadership-development.png",
    },
    {
        route: "/internship",
        label: "Internship",
        icon: "/icons/Internship.svg",
    },
    { route: "/jobs", label: "Job", icon: "/icons/Job.svg" },
    { route: "/scheme", label: "Scheme Search", icon: "/icons/Scheme.svg" },
    {
        route: "/reports",
        label: "Reports",
        icon: "/icons/chart-no-axes-gantt.svg",
    },
    {
        route: "/notifications",
        label: "Notifications",
        icon: "/icons/Notification.svg",
    },
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

export const JOB_TYPE = ["full-time", "part-time", "contract", "internship"];

// export const LOCATION_TYPE = [
//     "remote", "hybrid", "on-site"
// ];

export const EXPERIENCE_LEVEL = ["entry", "mid", "senior"];

export const MENTOR_CATEGORIES = [
    {
        _id: "6810a45dd497ca3501044e51",
        name: "Career Guidance",
        description: "Unlock your ideal career: expert mentorship for your journey",
        icon: "https://sdgstory.s3.ap-south-1.amazonaws.com/6815df652c616f8b71409990/1750233781291_0"
    },
    {
        _id: "6810a479d497ca3501044e56",
        name: "Admission Assistance",
        description: "Your path to the perfect program, guided by experience",
        icon: "https://sdgstory.s3.ap-south-1.amazonaws.com/6815df652c616f8b71409990/1750233831130_0"
    },
    {
        _id: "6810a4a3d497ca3501044e5b",
        name: "Personality Development",
        description: "Your path to the perfect program, guided by experience",
        icon: "https://sdgstory.s3.ap-south-1.amazonaws.com/6815df652c616f8b71409990/1750233867500_0"
    }
] as const;

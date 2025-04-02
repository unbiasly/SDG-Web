import { Notification } from "@/service/api.interface";

export const FEED_TABS = [
    "For You", 
    "The SDG News"
];

export const NOTIFICATION_TABS = [
    "All",
    "Job Alerts",
    "SDG Talks",
    "The SDG Event"
];

export const SCHEME_TABS = [
    "Categories",
    "State/UTs",
    "Central Ministeries",
];

export const VIDEO_TABS = [
    "The SDG Talks",
    "The SDG Podcast"
];

export const PROFILE_TABS = [
    // {id: "about", label: "About"},
    {id: "posts", label: "Posts"}
];


export const PROFILE_OPTIONS = [
    {route: "/", label: "Home", icon: "/icons/house.svg"},
    {route: "/profile", label: "Profile", icon: "/icons/circle-user-round.svg"},
    {route: '/goals', label: "The 17 Goals", icon: "/icons/Target.svg"}
    // {route: "/notifications", label: "Notifications", icon: "/icons/bell-ring.svg"},
    // {route: "/bookmarks", label: "Bookmarks", icon: "/icons/bookmark.svg"},
    // {route: "/videos", label: "Videos", icon: "/icons/tv-minimal-play.svg"},
    // {route: "/society", label: "The SDG Society", icon: "/icons/society.png"},
    // {route: "/mentorship", label: "Mentorship", icon: "/icons/leadership-development.png"},
    // {route: "/internship", label: "Internship", icon: "/icons/id-card.svg"},
    // {route: "/job", label: "Job", icon: "/icons/briefcase-business.svg"},
    // {route: "/scheme", label: "Scheme Search", icon: "/icons/chart-no-axes-gantt.svg"},
    // {route: "/settings", label: "Settings", icon: "/icons/settings.svg"}, 
    

        
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
      id: "1",
      type: "New Job Alert",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "2",
      type: "The SDG Talks",
      title: "Mr. Pawan Chaudry at Miranda house on 24 April '25",
      time: "6m"
    },
    {
      id: "3",
      type: "The SDG Event",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "4",
      type: "Followed by you",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "5",
      type: "The SDG Event",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "6",
      type: "New Job Alert",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "7",
      type: "The SDG Talks",
      title: "Mr. Pawan Chaudry at Miranda house on 24 April '25",
      time: "6m"
    },
    {
      id: "8",
      type: "Followed by you",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "9",
      type: "New Job Alert",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "10",
      type: "The SDG Talks",
      title: "Mr. Pawan Chaudry at Miranda house on 24 April '25",
      time: "6m"
    },
    {
      id: "11",
      type: "The SDG Event",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "12",
      type: "Followed by you",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "13",
      type: "The SDG Event",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "14",
      type: "New Job Alert",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
    {
      id: "15",
      type: "The SDG Talks",
      title: "Mr. Pawan Chaudry at Miranda house on 24 April '25",
      time: "6m"
    },
    {
      id: "16",
      type: "Followed by you",
      title: "Content Writer required at Ministry of Tourism",
      time: "6m"
    },
  ];

export const PROFILE_ANALYTICS = [
    {
        type: "views",
        count: 0,
        description: "Update your profile to attracts viewers."
    },
    {
        type: "impressions",
        count: 0,
        description: "Check out who's engaging with your posts."
    }
]

export const SETTINGS_OPTIONS = [
    { id: 'account', label: 'Your account' },
    { id: 'security', label: 'Security and account access' },
    { id: 'privacy', label: 'Privacy and safety' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'accessibility', label: 'Accessibility, display and languages' },
    { id: 'resources', label: 'Additional resources' },
    { id: 'help', label: 'Help Center' },
    { id: 'logout', label: 'Logout' },
    
  ];

export const SDG_NEWS = [
    // { id: "trending", title: "Trending News" },
    // { id: "top", title: "Top News" },
    // { id: "breaking", title: "Breaking News" },
    { id: "sdg", title: "SDG News" },
  ];
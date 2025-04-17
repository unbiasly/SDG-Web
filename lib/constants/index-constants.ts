import { Notification } from "@/service/api.interface";

export const FEED_TABS = [
    "For You", 
    // "The SDG News"
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
    {id: "about", label: "About"},
    {id: "posts", label: "Posts"}
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
    {id: "all", label: "All"},
    {id: "people", label: "People"},
    {id: "companies", label: "Companies"},
    {id: "ministries", label: "Videos"},
    {id: "news", label: "News"},
    {id: "society", label: "Society"}
]

export const PROFILE_OPTIONS = [
  {
    icon: '/icons/house.svg',
    label: 'Home',
    route: '/'
  },
  {route: "/bookmarks", label: "Bookmarks", icon: "/icons/bookmark.svg"},
  {route: '/goals', label: "The 17 Goals", icon: "/icons/Target.svg"},
  {route: "/videos", label: "Videos", icon: "/icons/tv-minimal-play.svg"},
  // {route: "/society", label: "The SDG Society", icon: "/icons/society.png"},
  // {route: "/mentorship", label: "Mentorship", icon: "/icons/leadership-development.png"},
  // {route: "/internship", label: "Internship", icon: "/icons/id-card.svg"},
  // {route: "/job", label: "Job", icon: "/icons/briefcase-business.svg"},
  {route: "/scheme", label: "Scheme Search", icon: "/icons/chart-no-axes-gantt.svg"},
  {route: "/notifications", label: "Notifications", icon: "/icons/bell-ring.svg"},
  {
    icon: '/icons/circle-user-round.svg',
    label: 'Profile',
    routeGenerator: (userId: string) => `/profile/${userId}`
  },
  {route: "/settings", label: "Settings", icon: "/icons/settings.svg"}, 
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
        description: "Update your profile to attracts viewers.",
        total_views: 100,
    },
    {
        type: "impressions",
        count: 0,
        description: "Check out who's engaging with your posts."
    }
]



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
    "It's something else"
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
    "Infringement"
  ];
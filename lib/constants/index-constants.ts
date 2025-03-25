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
    {id: "about", label: "About"},
    {id: "posts", label: "Posts"}
];

export const TSS_NEWS = {
    ARTICLE_TITLE: "Perfios, a B2B SaaS fintech company, has acquired CreditNirvana, an AI-driven debt management and collection platform. \"This acquisition is a strategic step in expanding our product suite and strengthening our capabilities in debt management,\" says Perfios CEO Sabyasachi Goswami. It also recently acquired fraud management company ClariS. Lenders in India spend over $7 billion.",

};

export const PROFILE_OPTIONS = [
    {route: "/", label: "Home", icon: "/icons/house.svg"},
    {route: "/notifications", label: "Notifications", icon: "/icons/bell-ring.svg"},
    {route: "/bookmarks", label: "Bookmarks", icon: "/icons/bookmark.svg"},
    {route: "/videos", label: "Videos", icon: "/icons/tv-minimal-play.svg"},
    {route: "/society", label: "The SDG Society", icon: "/icons/society.png"},
    {route: "/mentorship", label: "Mentorship", icon: "/icons/leadership-development.png"},
    {route: "/internship", label: "Internship", icon: "/icons/id-card.svg"},
    {route: "/job", label: "Job", icon: "/icons/briefcase-business.svg"},
    {route: "/scheme", label: "Scheme Search", icon: "/icons/chart-no-axes-gantt.svg"},
    {route: "/profile", label: "Profile", icon: "/icons/circle-user-round.svg"},
    {route: "/settings", label: "Settings", icon: "/icons/settings.svg", sub_options: [
        { route: "/account-settings", label: "Account Settings", icon: "/icons/user-round-pen.svg" },
        { route: "/privacy", label: "Privacy", icon: "/icons/globe-lock.svg" },
        { route: "/notification-settings", label: "Notification Settings", icon: "/icons/bell-ring.svg" },
    ]},
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
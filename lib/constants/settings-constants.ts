interface SettingOption {
    id: string;
    label: string;
    description: string;
    subOptions?: SubOption[];
    isToggle?: boolean;
  }
  
  // Add or update this type definition for sub-options
  interface SubOption {
    id: string;
    label: string;
    description?: string;
    sessionTab?: string; // Add this property
  }

export const ACCOUNT_OPTIONS = [
    {
        id: 'password',
        label: 'Change Password',
        description: 'Change your password at any time.',
        sessionTab: 'Change_Passord',
        // icon: <div />
    },
    {
        id: 'deactivate',
        label: 'Deactivate your account',
        description: 'Find out how you can deactivate your account.',
        sessionTab: 'Deactivate',
        // icon: <div />
    }
];

export const SECURITY_OPTIONS = [
    {
        id: 'apps-and-sessions',
        label: 'App and Sessions',
        description: 'See Information about when you logged into your account and the apps you connected to your account.',
        sessionTab: 'Sessions',
        // icon: <div />
    },
]

export const NOTIFICATIONS_OPTIONS = [
    {
        id: 'push-notifications',
        label: 'Push Notifications',
        description: 'Turn your notifications on or off.',

        // icon: <div />
    }
]

export const ADDITIONAL_RESOURCES_OPTIONS = [
    {
        id: 'terms-and-conditions',
        label: 'Terms and Conditions',
        description: "",
        // link: '/terms-and-conditions',
    },
    {
        id: 'privacy-policy',
        label: 'Privacy Policy',
        description: ""
    },
    {
        id: 'cookies-policy',
        label: 'Cookies Policy',
        description: ""
    },
    {
        id: 'legal',
        label: 'Legal',
        description: ""
    },
    {
        id: 'about-us',
        label: 'About Us',
        description: ""
    },
]
export const SETTINGS_OPTIONS: SettingOption[] = [
    {
        id: 'account',
        label: 'Your Account',
        description: 'See information about your account and download an archive of your data or learn more about your deactivation options.',
        subOptions: ACCOUNT_OPTIONS,
        // icon: <div />
    },
    {
        id: 'security',
        label: 'Security and Account Access',
        description: 'See information about your account and download an archive of your data or learn more about your deactivation options.',
        subOptions: SECURITY_OPTIONS,
        // icon: <div />
    },
    {
        id: 'notifications',
        label: 'Notifications',
        description: 'See information about your account and download an archive of your data or learn more about your deactivation options.',
        isToggle: true,
        subOptions: NOTIFICATIONS_OPTIONS,
        // icon: <div />
    },
    {
        id: 'additional-resources',
        label: 'Additional Resources',
        description: 'See information about your account and download an archive of your data or learn more about your deactivation options.',
        subOptions: ADDITIONAL_RESOURCES_OPTIONS,
        // icon: <div />
    },
]

export const DEACTIVATE_CONTENT = {
    title: "This will deactivate your account",
    description: "You're about to start the process of deactivating your TSS account. Your display name, username, and public profile will no longer be viewable on TSS.com, TSS for iOS, or TSS for Android.",
    additionalInfo: [
        "You can restore your account if it was accidentally or wrongfully deactivated for up to 30 days after deactivation.",
        "Some account information may still be available in search engines, such as Google or Bing. Learn more",
        "If you just want to change your username, you don't need to deactivate your account — edit it in your settings.",
        "To use your current username or email address with a different Unbiasly account, change them before you deactivate this account.",
        "If you want to download your data, you'll need to complete both the request and download process before deactivating your account. Links to download your data cannot be sent to deactivated accounts."
    ]
}

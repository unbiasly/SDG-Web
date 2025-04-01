"use client"
import AccountDetails from '@/components/settings/AccountDetails';
import Settings from '@/components/settings/Settings';
import React, { useState } from 'react'

const Page = () => {
    const [activeSection, setActiveSection] = useState('account');

    return (
        <div className="flex flex-1 overflow-hidden">
          <Settings 
            className="w-full md:w-[320px] lg:w-[360px]" 
            onSelectSetting={setActiveSection}
            activeSection={activeSection}
          />
          
          <AccountDetails 
            className="hidden md:block flex-1"
            section={activeSection}
          />
        </div>
    );
}

export default Page
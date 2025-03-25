
import { MOCK_NOTIFICATIONS } from '@/lib/constants/index-constants';
import React from 'react'
import Alerts from './Alerts';
import { ScrollArea } from '../ui/scroll-area';
const NotificationList = ({ activeTab }: { activeTab: string }) => {

    const notifications = MOCK_NOTIFICATIONS;
  return (
    <>
        {activeTab === "All" && (
        <ScrollArea>
            {notifications.map((notification) => (
            <Alerts
                key={notification.id}
                type={notification.type}
                title={notification.title}
                time={notification.time}
            />
            ))}
        </ScrollArea>
        )}
        {activeTab === "Job Alerts" && (
            <div>
                {notifications.filter(notification => notification.type === "New Job Alert").map((notification) => (
                    <Alerts
                        key={notification.id}
                        type={notification.type}
                        title={notification.title}
                        time={notification.time}
                    />
                ))}
            </div>
        )}
        {activeTab === "SDG Talks" && (
            <div>
                {notifications.filter(notification => notification.type === "The SDG Talks").map((notification) => (
                    <Alerts
                        key={notification.id}
                        type={notification.type}
                        title={notification.title}
                        time={notification.time}
                    />
                ))}
            </div>
        )}
        {activeTab === "The SDG Event" && (
            <div>
                {notifications.filter(notification => notification.type === "The SDG Event").map((notification) => (
                    <Alerts
                        key={notification.id}
                        type={notification.type}
                        title={notification.title}
                        time={notification.time}
                    />
                ))}
            </div>
        )}

    </>
  )
}

export default NotificationList
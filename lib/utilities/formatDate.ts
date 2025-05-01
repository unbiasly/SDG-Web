export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();
  
  // Get time difference in milliseconds
  const diffMs = currentDate.getTime() - date.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  // Less than a minute
  if (diffSec < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  }
  
  // Less than a month (approx 30 days)
  if (diffDay < 30) {
    const diffWeek = Math.floor(diffDay / 7);
    return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // Less than a year
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
  }
  
  // More than a year
  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
}

// Optional: You might also want a function that gives a more detailed format for certain contexts
export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
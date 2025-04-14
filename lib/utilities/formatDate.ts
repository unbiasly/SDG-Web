export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    // Options for formatting the date
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long', // e.g., "Monday"
        year: 'numeric', // e.g., "2025"
        month: 'long', // e.g., "January"
        day: 'numeric', // e.g., "28"
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric', // e.g., "7"
        minute: 'numeric', // e.g., "07"
        // second: 'numeric', // e.g., "48"
    };
    
    // Use toLocaleString to format the date
    if (dateString) {
        const formattedDate = date.toLocaleString('en-US', dateOptions);
        const formattedTime = date.toLocaleString('en-US', timeOptions);
        return `${formattedDate} at ${formattedTime}`;
    } else {
        return date.toLocaleString('en-US', timeOptions);
    }
}
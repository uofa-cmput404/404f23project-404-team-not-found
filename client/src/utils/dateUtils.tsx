export function formatDateTime(date_str: string): string {
    // TypeScript Date Object: https://www.javatpoint.com/typescript-date-object
    const date = new Date(date_str);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Convert 24-hour format to 12-hour format and determine AM or PM
    const twelveHour = hours % 12 || 12;
    const amOrPm = hours < 12 ? "AM" : "PM";

    return `${twelveHour}:${minutes} ${amOrPm}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

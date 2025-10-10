export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

// CHECK DATE EXPIRTATION
export const isDateExpired = (date, expiryDays) => {
    const targetDate = new Date(date);
    const now = new Date();

    const diffInDays = (now - targetDate) / (1000 * 60 * 60 * 24);

    return diffInDays > expiryDays;
};

// CONVERT TIMESTAMP TO DAY
export const timestampToDay = (timestamp) => {
    const pastDate = new Date(timestamp);
    const now = new Date();

    const diffInMs = now - pastDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays == 0) return "Today";
    if (diffInDays == 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week(s) ago`;

    return `${Math.floor(diffInDays / 30)} month(s) ago`;
};
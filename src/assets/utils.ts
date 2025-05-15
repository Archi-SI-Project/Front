export function formatDate(date: string | Date): string {
    let formattedDate = date;
    if (typeof formattedDate === 'string') {
        formattedDate = new Date(formattedDate);
    }
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = formattedDate.getFullYear();
    return `${day}/${month}/${year}`;
}
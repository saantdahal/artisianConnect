/**
 * Format a number as Nepali Rupees (Rs.)
 * @param amount - The price amount
 * @returns Formatted price string like "Rs. 1,234.00"
 */
export function formatPrice(amount: number): string {
    return `Rs. ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

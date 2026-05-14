import crypto from "crypto";

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
const ESEWA_STATUS_CHECK_URL =
    process.env.ESEWA_STATUS_CHECK_URL ||
    "https://rc.esewa.com.np/api/epay/transaction/status/";

/**
 * Generate HMAC-SHA256 signature for eSewa ePay V2
 */
export function generateEsewaSignature(message: string): string {
    const hmac = crypto.createHmac("sha256", ESEWA_SECRET_KEY);
    hmac.update(message);
    return hmac.digest("base64");
}

/**
 * Generate a unique transaction UUID: YYMMDD-HHmmss-random
 */
export function generateTransactionUuid(): string {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const rand = crypto.randomBytes(3).toString("hex");
    return `${yy}${mm}${dd}-${hh}${min}${ss}-${rand}`;
}

/**
 * Build the signature message for eSewa ePay V2
 * The signed fields must be: total_amount,transaction_uuid,product_code
 */
export function buildSignatureMessage(
    totalAmount: number,
    transactionUuid: string,
): string {
    return `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
}

/**
 * Verify eSewa payment response by decoding and validating signature
 */
export function verifyEsewaResponse(encodedData: string): {
    valid: boolean;
    data: {
        transaction_code: string;
        status: string;
        total_amount: number;
        transaction_uuid: string;
        product_code: string;
        signed_field_names: string;
        signature: string;
    } | null;
} {
    try {
        const decoded = Buffer.from(encodedData, "base64").toString("utf-8");
        const data = JSON.parse(decoded);

        // Re-generate signature based on signed_field_names
        const signedFields: string[] = data.signed_field_names.split(",");
        const message = signedFields
            .map((field: string) => `${field}=${data[field]}`)
            .join(",");

        const expectedSignature = generateEsewaSignature(message);

        if (expectedSignature !== data.signature) {
            return { valid: false, data: null };
        }

        return { valid: true, data };
    } catch {
        return { valid: false, data: null };
    }
}

/**
 * Check transaction status with eSewa's status API
 */
export async function checkTransactionStatus(
    totalAmount: number,
    transactionUuid: string,
    productCode: string = ESEWA_PRODUCT_CODE,
): Promise<{
    status: string;
    ref_id: string | null;
}> {
    const url = `${ESEWA_STATUS_CHECK_URL}?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`eSewa status check failed with status ${res.status}`);
    }

    return res.json();
}

export { ESEWA_PRODUCT_CODE };

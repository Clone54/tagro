
/**
 * Real SMS Service Client
 * This file contains functions to communicate with our secure serverless functions.
 */

interface OrderData {
    orderId: string;
    userName: string;
    totalAmount: string;
}

/**
 * Sends a request to the backend to dispatch an OTP to a given phone number using a specified message template.
 * @param phoneNumber The phone number to send the OTP to.
 * @param messageTemplate The message template, which must include the `{otp}` placeholder.
 * @returns A promise that resolves with an object containing the success status and the OTP.
 */
export const sendOtp = async (phoneNumber: string, messageTemplate: string): Promise<{ otp: string }> => {
    try {
        const response = await fetch('/api/sms/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, messageTemplate }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to send OTP.');
        }

        console.log(`[SMS Service] OTP requested for ${phoneNumber}. OTP received from server: ${data.otp}`);
        return { otp: data.otp };

    } catch (error) {
        console.error("Error in sendOtp request:", error);
        throw error;
    }
};

/**
 * Sends a request to the backend to dispatch an order confirmation SMS.
 * @param phoneNumber The customer's phone number.
 * @param messageTemplate The message template with placeholders like `{orderId}`.
 * @param orderData An object containing data to fill in the template's placeholders.
 */
export const sendOrderConfirmationSms = async (phoneNumber: string, messageTemplate: string, orderData: OrderData): Promise<void> => {
     try {
        const response = await fetch('/api/send-order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, messageTemplate, orderData }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to send order confirmation SMS.');
        }

        console.log(`[SMS Service] Order confirmation sent to ${phoneNumber}.`);

    } catch (error) {
        console.error("Error in sendOrderConfirmationSms request:", error);
        throw error;
    }
};

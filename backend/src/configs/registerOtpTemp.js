export const registerOtpFormat = (name, otp) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #1f2937;">
            <h2 style="margin-bottom: 12px; color: #15803d;">Verify your GroceryHub account</h2>
            <p style="margin-bottom: 16px;">Hi ${name},</p>
            <p style="margin-bottom: 16px;">
                Use the verification code below to finish creating your account. This code will expire in 10 minutes.
            </p>
            <div style="margin: 24px 0; padding: 18px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #166534;">
                    One-Time Password
                </p>
                <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 0.2em; color: #14532d;">
                    ${otp}
                </p>
            </div>
            <p style="margin-bottom: 0;">
                If you did not request this, you can safely ignore this email.
            </p>
        </div>
    `;
};

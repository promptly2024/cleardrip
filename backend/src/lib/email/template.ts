export const UserSignUpTemplate = (name: string, email: string) => {
    return `
    <html>
    <body>
        <h1>Welcome to ClearDrip, ${name}!</h1>
        <p>Thank you for signing up with the email: ${email}.</p>
        <p>We're excited to have you on board!</p>
    </body>
    </html>
    `;
}
export const PasswordResetTemplate = (name: string, resetLink: string) => {
    return `
    <html>
    <body>
        <h1>Password Reset Request</h1>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}">Reset Password</a>
    </body>
    </html>
    `;
}
export const PasswordChangeConfirmationTemplate = (name: string) => {
    return `
    <html>
    <body>
        <h1>Password Change Confirmation</h1>
        <p>Hello ${name},</p>
        <p>Your password has been successfully changed.</p>
    </body>
    </html>
    `;
}

export const AdminUserCreationTemplate = (name: string, email: string, tempPassword: string) => {
    return `
    <html>
    <body>
        <h1>Admin Account Created</h1>
        <p>Hello ${name},</p>
        <p>Your admin account has been successfully created with the email: ${email}.</p>
        <p>Please use the temporary password provided to log in:</p>
        <p><strong>Temporary Password: ${tempPassword}</strong></p>
        <p>Make sure to change your password after logging in for the first time.</p>
    </body>
    </html>
    `;
}

import sendEmail from './sendEmail';

export const sendPasswordResetEmail = async (
    email: string,
    resetToken: string,
    userName: string
) => {
    // Rename the url before going to production
    const resetUrl = `http://localhost:3000/user/reset-password?token=${resetToken}`;
    
    const subject = 'Password Reset Request - ClearDrip';
    
    const message = `Hi ${userName},

You recently requested to reset your password for your ClearDrip account. Click the link below to reset your password:

${resetUrl}

This link will expire in 30 minutes.

If you didn't request this password reset, please ignore this email or contact support if you have concerns.

Best regards,
ClearDrip Team`;
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                .button:hover { background: #5568d3; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .link-text { word-break: break-all; color: #667eea; font-size: 12px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi ${userName},</p>
                    
                    <p>You recently requested to reset your password for your ClearDrip account. Click the button below to reset your password:</p>
                    
                    <div style="text-align: center;">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    
                    <p>Or copy and paste this link in your browser:</p>
                    <p class="link-text">${resetUrl}</p>
                    
                    <div class="warning">
                        <strong>⏰ Important:</strong> This link will expire in 30 minutes. If you don't reset your password within this time, you'll need to request a new reset link.
                    </div>
                    
                    <p>If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
                    
                    <p>If you have any questions or concerns, please contact our support team.</p>
                    
                    <div class="footer">
                        <p>© 2025 ClearDrip. All rights reserved.</p>
                        <p>This is an automated email. Please do not reply to this message.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return await sendEmail(email, subject, message, html);
};

// This is a placeholder - implement with your preferred email service
// (SendGrid, Resend, Nodemailer, etc.)

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  // Example with console log - replace with actual email service
  console.log(`Password reset email for ${email}: ${resetUrl}`);

  // Example implementation with a service like Resend:
  /*
  import { Resend } from 'resend'
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'noreply@yourapp.com',
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `
  })
  */
}

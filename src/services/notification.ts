import nodemailer from 'nodemailer';
import logger from '../utils/logger';

interface EmailOptions {
  taskId: string;
  taskSummary: string;
  taskDescription: string;
  jiraLink: string;
  assignee?: string;
  priority?: string;
  createdAt?: string;
}

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'akhiltlmal@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '',
  },
});

/**
 * Send email notification for new Jira task
 */
export const sendTaskNotification = async (options: EmailOptions): Promise<void> => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0052CC; color: white; padding: 20px; border-radius: 5px; }
          .content { padding: 20px; background: #f5f5f5; margin-top: 10px; border-radius: 5px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #0052CC; }
          .button { display: inline-block; margin-top: 15px; padding: 10px 20px; background: #0052CC; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎯 New UX Research Task Created</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Task ID:</span> ${options.taskId}
            </div>
            <div class="field">
              <span class="label">Summary:</span> ${options.taskSummary}
            </div>
            <div class="field">
              <span class="label">Description:</span> ${options.taskDescription}
            </div>
            ${options.assignee ? `<div class="field"><span class="label">Assigned To:</span> ${options.assignee}</div>` : ''}
            ${options.priority ? `<div class="field"><span class="label">Priority:</span> ${options.priority}</div>` : ''}
            ${options.createdAt ? `<div class="field"><span class="label">Created:</span> ${options.createdAt}</div>` : ''}
            <a href="${options.jiraLink}" class="button">View in Jira</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER || 'akhiltlmal@gmail.com',
      to: process.env.EMAIL_RECIPIENT || 'akhiltlmal@gmail.com',
      subject: `🎯 New Task: ${options.taskSummary}`,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email notification sent for task ${options.taskId}`);
  } catch (error) {
    logger.error('Failed to send email notification:', error);
    throw error;
  }
};

/**
 * Send email when analysis is complete
 */
export const sendAnalysisCompleteEmail = async (
  taskId: string,
  taskSummary: string,
  findings: string
): Promise<void> => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #36B37E; color: white; padding: 20px; border-radius: 5px; }
          .content { padding: 20px; background: #f5f5f5; margin-top: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✅ Research Analysis Complete</h2>
          </div>
          <div class="content">
            <p><strong>Task:</strong> ${taskSummary}</p>
            <p><strong>Findings:</strong></p>
            <p>${findings}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER || 'akhiltlmal@gmail.com',
      to: process.env.EMAIL_RECIPIENT || 'akhiltlmal@gmail.com',
      subject: `✅ Analysis Complete: ${taskSummary}`,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Analysis completion email sent for task ${taskId}`);
  } catch (error) {
    logger.error('Failed to send analysis complete email:', error);
    throw error;
  }
};

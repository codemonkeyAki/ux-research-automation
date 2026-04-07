import axios from 'axios';
import logger from '../utils/logger';
import { sendTaskNotification, sendAnalysisCompleteEmail } from '../services/notification';
import { analyzeResearch } from '../services/claude';
import { publishToConfluence } from '../services/confluence';
import { generatePDFReport } from '../utils/pdf-generator';

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description: string;
    assignee?: { displayName: string };
    priority?: { name: string };
    created: string;
    updated: string;
    status: { name: string };
  };
}

// Store of processed tasks to avoid duplicates
const processedTasks = new Set<string>();

/**
 * Poll Jira API for new tasks in project UD
 */
export const pollJiraTasks = async (): Promise<void> => {
  try {
    logger.info('Starting Jira task poll...');

    const jiraHost = process.env.JIRA_HOST || '';
    const jiraUsername = process.env.JIRA_USERNAME || '';
    const jiraApiToken = process.env.JIRA_API_TOKEN || '';
    const projectKey = process.env.JIRA_PROJECT || 'UD';

    if (!jiraHost || !jiraUsername || !jiraApiToken) {
      throw new Error('Missing Jira credentials in environment variables');
    }

    // Create Basic Auth header
    const auth = Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64');

    // Fetch issues from Jira API
    const response = await axios.get(
      `${jiraHost}/rest/api/3/projects/${projectKey}/issues?orderBy=-created&maxResults=10`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const issues: JiraIssue[] = response.data.issues || [];
    logger.info(`Found ${issues.length} issues in project ${projectKey}`);

    for (const issue of issues) {
      const taskId = issue.key;

      // Skip if already processed
      if (processedTasks.has(taskId)) {
        logger.debug(`Task ${taskId} already processed, skipping`);
        continue;
      }

      logger.info(`Processing new task: ${taskId}`);
      processedTasks.add(taskId);

      try {
        // Extract task details
        const taskSummary = issue.fields.summary;
        const taskDescription = issue.fields.description || '';
        const assignee = issue.fields.assignee?.displayName || 'Unassigned';
        const priority = issue.fields.priority?.name || 'Medium';
        const jiraLink = `${jiraHost}/browse/${taskId}`;
        const createdAt = new Date(issue.fields.created).toLocaleDateString();

        // 1️⃣ SEND EMAIL NOTIFICATION FOR NEW TASK
        logger.info(`Sending email notification for ${taskId}`);
        await sendTaskNotification({
          taskId,
          taskSummary,
          taskDescription,
          jiraLink,
          assignee,
          priority,
          createdAt,
        });

        // 2️⃣ TRIGGER RESEARCH ANALYSIS
        logger.info(`Starting research analysis for ${taskId}`);
        const analysis = await analyzeResearch(taskSummary, taskDescription);

        // 3️⃣ SEND ANALYSIS COMPLETE EMAIL
        logger.info(`Sending analysis complete email for ${taskId}`);
        await sendAnalysisCompleteEmail(taskId, taskSummary, analysis.findings);

        // 4️⃣ PUBLISH TO CONFLUENCE
        logger.info(`Publishing findings to Confluence for ${taskId}`);
        await publishToConfluence(taskId, taskSummary, analysis);

        // 5️⃣ GENERATE PDF REPORT
        logger.info(`Generating PDF report for ${taskId}`);
        const pdfPath = await generatePDFReport(taskId, taskSummary, analysis);
        logger.info(`PDF report generated at: ${pdfPath}`);

        logger.info(`✅ Completed processing for ${taskId}`);
      } catch (error) {
        logger.error(`Error processing task ${taskId}:`, error);
      }
    }

    logger.info('Jira poll completed');
  } catch (error) {
    logger.error('Error polling Jira tasks:', error);
    throw error;
  }
};

// Run poller if this is the main module
if (require.main === module) {
  pollJiraTasks()
    .then(() => {
      logger.info('Poll completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Poll failed:', error);
      process.exit(1);
    });
}

export default pollJiraTasks;

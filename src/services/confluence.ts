import axios from 'axios';
import logger from '../utils/logger';

interface ConfluencePageData {
  title: string;
  content: string;
}

/**
 * Publish findings to Confluence
 */
export const publishToConfluence = async (
  taskId: string,
  taskSummary: string,
  analysis: any
): Promise<void> => {
  try {
    logger.info(`Publishing to Confluence for ${taskId}`);

    const confluenceHost = process.env.CONFLUENCE_HOST || '';
    const confluenceUsername = process.env.CONFLUENCE_USERNAME || '';
    const confluenceToken = process.env.CONFLUENCE_API_TOKEN || '';
    const confluenceSpace = process.env.CONFLUENCE_SPACE || 'MD';

    if (!confluenceHost || !confluenceUsername || !confluenceToken) {
      logger.warn('Confluence credentials missing, skipping publish');
      return;
    }

    const auth = Buffer.from(
      `${confluenceUsername}:${confluenceToken}`
    ).toString('base64');

    const pageContent = `
<h2>Research Analysis: ${taskSummary}</h2>
<h3>Task ID: ${taskId}</h3>
<p>${analysis.findings}</p>
<h3>Recommendations</h3>
<p>${analysis.recommendations}</p>
`;

    const pageData = {
      type: 'page',
      title: `Research: ${taskSummary}`,
      space: { key: confluenceSpace },
      body: {
        storage: {
          value: pageContent,
          representation: 'storage',
        },
      },
    };

    await axios.post(`${confluenceHost}/wiki/rest/api/content`, pageData, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`Successfully published to Confluence for ${taskId}`);
  } catch (error) {
    logger.error(`Error publishing to Confluence for ${taskId}:`, error);
    throw error;
  }
};

export default { publishToConfluence };

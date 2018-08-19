/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.notification = (event, context) => {
  const pubSubMessage = Buffer.from(event.data, 'base64').toString();
  const pubSubData = JSON.parse(pubSubMessage) || {};

  const source = pubSubData.source || {};
  const repoSource = source.repoSource || {};
  const repoName = repoSource.repoName || '';

  if (repoName === 'cloud-build-sample') {
    const { IncomingWebhook } = require('@slack/client');
    const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
    const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

    const message = createSlackMessage(pubSubData);

    webhook.send(message, () => null);
  }
};

const createSlackMessage = (build) => {
  return {
    text: `Build ${build.id}`,
    mrkdwn: true,
    attachments: [
      {
        title: 'Build logs',
        title_link: build.logUrl,
        fields: [{
          title: 'Status',
          value: build.status
        }]
      }
    ]
  };
};

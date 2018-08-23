/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.notification = (event, context) => {
  const pubSubMessage = Buffer.from(event.data, 'base64').toString();
  const pubSubData = JSON.parse(pubSubMessage) || {};

  const repoName = getRepoName(pubSubData);

  if (repoName) {
    const { IncomingWebhook } = require('@slack/client');

    const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    const message = createSlackMessage(pubSubData);

    if (message) {
      console.log(pubSubMessage);
      webhook.send(message, () => null);
    }
  }
};

const createSlackMessage = (build) => {
  const {
    repository,
    branchName,
    commitSha,
    commitUrl,
  } = getSlackParts(build);

  const environment = process.env.APP_ENV;

  const title = {
    'WORKING': `${environment}の${repository}を更新します🙏`,
    'SUCCESS': `${environment}の${repository}を更新しました🎉`,
  }[build.status];

  if (!title) {
    return null;
  }

  return {
    text: title,
    attachments: [
      {
        title: `Cloud Build ${repository}`,
        title_link: build.logUrl,
        fields: [{
          title: branchName,
          value: `<${commitUrl}|${commitSha}>`,
        }]
      }
    ]
  };
};

const getCommitSha = (build) => {
  const sourceProvenance = build.sourceProvenance || {};
  const resolvedRepoSource = sourceProvenance.resolvedRepoSource || {};
  return resolvedRepoSource.commitSha || '';
};

const getRepoName = (build) => {
  const source = build.source || {};
  const repoSource = source.repoSource || {};
  return repoSource.repoName || '';
};

const getBranchName = (build) => {
  const source = build.source || {};
  const repoSource = source.repoSource || {};
  return repoSource.branchName || '';
};

const getSlackParts = (build) => {
  const repoName = getRepoName(build);
  const branchName = getBranchName(build);
  const commitSha = getCommitSha(build);

  let repository = repoName;
  let repositoryUrl = `https://console.cloud.google.com/code/develop/browse/${repoName}`;
  let commitUrl = `${repositoryUrl}/${commitSha}`;

  if (repoName.indexOf('github-') === 0) {
    const repoNameParts = repoName.split('-');
    repoNameParts.shift();

    const organization = repoNameParts.shift();

    repository = repoNameParts.join('-');
    repositoryUrl = `https://github.com/${organization}/${repository}`;
    commitUrl = `${repositoryUrl}/commit/${commitSha}`;
  }

  return {
    repository,
    branchName,
    commitSha,
    commitUrl,
  };
};
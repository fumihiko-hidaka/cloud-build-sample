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
    console.log(JSON.stringify(pubSubData, null, 2));
  }
};

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.notification = (event, context) => {
  const pubSubMessage = Buffer.from(event.data, 'base64').toString();
  const pubSubData = JSON.parse(pubSubMessage) || {};

  const status = pubSubData.status || '';
  const source = pubSubData.source || {};
  const repoSource = source.repoSource || {};
  const repoName = repoSource.repoName || '';

  if (repoName === 'cloud-build-sample') {
    console.log(JSON.stringify({
      message: 'debug_logging',
      status,
      pubSubData,
    }, null, 2));
  }
};

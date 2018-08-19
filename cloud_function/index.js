/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = (event, context) => {
  const pubSubMessage = event.data;
  console.log(Buffer.from(pubSubMessage, 'base64').toString());
};

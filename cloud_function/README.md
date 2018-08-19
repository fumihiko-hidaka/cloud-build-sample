# deploy

gcloud beta functions deploy cloud-build-notification \
  --runtime nodejs8 \
  --region asia-northeast1 \
  --project neko-tech-test \
  --source https://source.developers.google.com/projects/neko-tech-test/repos/cloud-build-sample/moveable-aliases/master/paths/cloud_function/ \
  --entry-point notification \
  --trigger-resource cloud-builds \
  --trigger-event google.pubsub.topic.publish

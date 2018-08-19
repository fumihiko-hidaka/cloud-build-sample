# deploy raw
gcloud app deploy --project neko-tech-test --version 1 app.yaml

# deploy by cloud build
gcloud builds submit --project neko-tech-test --config cloudbuild.yaml .

# Deployment Guide

This document describes how to deploy the ReminderAds backend and frontend to production.

## Backend (FastAPI to Google Cloud Run)

FastAPI can be easily containerized and deployed to Google Cloud Run, providing automatic scaling and built-in HTTPS.

### 1. Build and push the container image
We will use Google Cloud Build to compile the container and push it to Artifact Registry:
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/reminderads-backend .
```

### 2. Deploy to Cloud Run
Execute the following to launch the service:
```bash
gcloud run deploy reminderads-backend \
    --image gcr.io/[PROJECT_ID]/reminderads-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars GOOGLE_CLOUD_PROJECT=[PROJECT_ID]
```

*Note: Ensure CORS settings in `backend/app/main.py` allow your production frontend domain.*

---

## Frontend (React + Vite to Vercel/Firebase)

The React dashboard can be built as static assets and deployed to Firebase Hosting or Vercel.

### 1. Configure API Base URL
Modify the API base URL in `frontend/src/services/workflow.service.ts` to point to the Cloud Run URL.

### 2. Compile assets
```bash
cd frontend
npm run build
```

### 3. Deploy to Firebase
Initialize Firebase Hosting and deploy the `dist/` directory:
```bash
firebase init hosting
firebase deploy
```

# Firebase Storage CORS Configuration

## Manual CORS Setup Required

To fix the CORS errors for Firebase Storage, you need to configure CORS settings manually through Google Cloud Console.

### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project: `ywinememory-4bdf9`

2. **Navigate to Cloud Storage**
   - Go to Cloud Storage > Buckets
   - Find your bucket: `ywinememory-4bdf9.firebasestorage.app`

3. **Configure CORS**
   - Click on the bucket name
   - Go to "Configuration" tab
   - Click "Edit CORS configuration"
   - Add the following JSON:

```json
[
  {
    "origin": [
      "https://mywinememory-4bdf9.web.app",
      "https://my-wine-memory.himazi.com",
      "http://localhost:5173",
      "http://localhost:4173"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type", 
      "Access-Control-Allow-Origin", 
      "Access-Control-Allow-Methods", 
      "Access-Control-Allow-Headers", 
      "Access-Control-Max-Age"
    ]
  }
]
```

4. **Save the configuration**

### Alternative: Using gsutil (if available)

If you have Google Cloud SDK installed:

```bash
gsutil cors set storage-cors.json gs://ywinememory-4bdf9.firebasestorage.app
```

### Verification

After setting up CORS, test by uploading an image in the application. The CORS errors should disappear.
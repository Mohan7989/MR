# Step-by-Step Free Deployment Guide

**Reality Check:** Deploying a 9-service Microservices Backend + MySQL for *free* on cloud platforms (AWS/Render/Heroku) is impossible because Java consumes too much RAM.

**The Solution:** The "Hybrid Tunnel" Method.
- **Frontend** lives on the Cloud (Vercel/Netlify) -> **Fast & Free**.
- **Backend** lives on your Laptop -> **Powerful & Free**.
- **Tunnel (Ngrok)** connects them -> **Magic**.

---

## Step 1: Run Backend Locally
You need your backend running perfectly on your machine first.
1.  Open Terminal in `mrca-students-hub-backend 1/mrca-students-hub-java3`.
2.  Run: `docker-compose up --build`
    *   *Alternative (No Docker):* Manually start `eureka-server`, `api-gateway`, and other services in separate terminals.
3.  Verify API Gateway is working at `http://localhost:8080`.

## Step 2: Expose Backend to the World
Use **Ngrok** to give your local `http://localhost:8080` a public internet address.
1.  **Download Ngrok**: [https://ngrok.com/download](https://ngrok.com/download)
2.  **SignUp/Login**: Get your Authtoken from the dashboard.
3.  **Connect Account**:
    ```cmd
    ngrok config add-authtoken YOUR_TOKEN
    ```
4.  **Start Tunnel**:
    ```cmd
    ngrok http 8080
    ```
5.  **Copy URL**: Look for the "Forwarding" line. It will look like:
    `https://1a2b-3c4d.ngrok-free.app`
    -> **Copy this URL**. This is your **Public Backend URL**.

## Step 3: Configure Frontend for Production
Now tell your frontend to talk to this new Public URL instead of localhost.

1.  Open `frontend-react/src/lib/api-client.ts` (or wherever your API base URL is defined).
2.  Change the Base URL:
    ```typescript
    // Replace 'http://localhost:8080' with your Ngrok URL
    const BASE_URL = "https://1a2b-3c4d.ngrok-free.app"; 
    ```
    *(Ideally, use an environment variable like `import.meta.env.VITE_API_URL`)*

3.  **Commit your changes**:
    ```bash
    git add .
    git commit -m "Update API URL for production"
    git push
    ```

## Step 4: Deploy Frontend to Cloud (Vercel)
1.  Go to [Vercel.com](https://vercel.com) and Sign Up (Free).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub Repository (`MR`).
4.  **Configure Project**:
    - Framework Preset: `Vite`
    - Root Directory: `frontend-react` (Important! Click "Edit" and select the `frontend-react` folder).
5.  Click **Deploy**.

## Success!
- **User visits**: `https://your-project.vercel.app` (Global Internet)
- **Frontend talks to**: `https://1a2b...ngrok.app` (Tunnel)
- **Tunnel talks to**: `Your Localhost:8080` (Your Laptop)

**Note**: Since your backend is on your laptop, the website will only work **while your laptop is on and Ngrok is running**. This is perfect for demos and presentations!

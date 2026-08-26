# Meta Leads → React Native POC

A real-time Proof of Concept that captures leads submitted through a Meta Lead Ad form and displays them live inside an already-open React Native application.

## 🚀 How It Works

```text
Meta Lead Form
      │
      ▼
Meta Webhook
      │
      ▼
Node.js / Express Backend
      │
      ├── Fetch lead details from Meta Graph API
      │
      ▼
WebSocket Server
      │
      ▼
React Native App
      │
      ▼
Live Lead Card
```

## ✨ Features

- Meta Lead Ads webhook integration
- Meta Graph API lead retrieval
- Real-time lead delivery using WebSockets
- React Native mobile client
- No manual refresh required
- Supports multiple incoming leads
- Environment-based secret configuration
- Cloudflare Tunnel support for public webhook access

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- WebSocket (`ws`)
- Meta Graph API

### Mobile
- React Native
- JavaScript

### Infrastructure
- Cloudflare Tunnel
- Meta Lead Testing Tool

## 📁 Project Structure

```text
meta-leads-poc/
│
├── mobile/
│   ├── App.js
│   ├── package.json
│   └── ...
│
├── server/
│   ├── routes/
│   │   └── webhook.js
│   ├── index.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd meta-leads-poc
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create:

```text
server/.env
```

Add the required Meta credentials:

```env
META_ACCESS_TOKEN=your_meta_access_token
VERIFY_TOKEN=your_webhook_verify_token
```

> Never commit the `.env` file to GitHub.

### 4. Start the backend

```bash
cd server
npm start
```

The backend runs locally on:

```text
http://localhost:3000
```

### 5. Start the React Native application

In another terminal:

```bash
cd mobile
npm install
npx react-native run-android
```

The mobile application connects to the backend through WebSockets.

## 🌐 Webhook Setup

For Meta to reach the local backend, expose the server using a Cloudflare Tunnel.

Example:

```bash
cloudflared tunnel --url http://localhost:3000
```

Use the generated public URL as the Meta webhook callback URL:

```text
https://<public-domain>/webhook
```

The webhook verification token must match the value configured in:

```text
server/.env
```

## 🧪 Testing

The project uses the **Meta Lead Testing Tool** to simulate lead submissions.

Test flow:

1. Start the Node.js backend.
2. Start the React Native application.
3. Make sure the WebSocket connection is established.
4. Start the Cloudflare Tunnel.
5. Configure the public webhook URL in Meta.
6. Submit a test lead using the Meta Lead Testing Tool.
7. Meta sends the `leadgen` webhook event.
8. The backend receives the lead ID.
9. The backend retrieves the lead details through the Graph API.
10. The backend broadcasts the lead through WebSocket.
11. React Native receives the lead.
12. The new lead appears immediately on the screen.

## 🔐 Security

Sensitive credentials are stored in environment variables and excluded from Git using `.gitignore`.

Never commit:

```text
.env
node_modules/
```

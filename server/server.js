require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const { router: webhookRouter, setBroadcastLead } = require("./routes/webhook");

const app = express();

app.use(cors());
app.use(express.json());

// Privacy Policy
app.get("/privacy-policy", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Privacy Policy - Leads POC</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>

    <body style="
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    ">
      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy explains how Leads POC handles information
        submitted through our lead generation forms.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect information such as your name, email address,
        and phone number when you voluntarily submit a lead form.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        The information is used to respond to inquiries and communicate
        with potential customers.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal information to third parties.
      </p>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to protect the information
        submitted through our forms.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this Privacy Policy,
        please contact us.
      </p>
    </body>
    </html>
  `);
});

// Meta webhook
app.use("/webhook", webhookRouter);

const PORT = 3000;

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Send real leads to React Native clients
setBroadcastLead((lead) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(lead));
    }
  });

  console.log("Lead sent to React Native:", lead);
});

// WebSocket connection
wss.on("connection", (socket) => {
  console.log("React Native client connected");

  socket.on("close", () => {
    console.log("React Native client disconnected");
  });
});

// Temporary test endpoint
app.post("/test-lead", (req, res) => {
  const lead = {
    id: Date.now().toString(),
    name: "Test User",
    email: "test@example.com",
    phone: "+91 9999999999",
  };

  // Send test lead to every connected React Native client
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(lead));
    }
  });

  console.log("Test lead sent:", lead);

  res.status(200).json({
    message: "Lead sent",
    lead,
  });
});

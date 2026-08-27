const express = require("express");
const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Temporary: Page Access Token
// Isko production mein .env mein rakhna hai.
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// WebSocket broadcast function
let broadcastLead = null;

const setBroadcastLead = (fn) => {
  broadcastLead = fn;
};

// Meta webhook verification
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Meta lead webhook
router.post("/", async (req, res) => {
  console.log("Meta webhook received:");
  console.log(JSON.stringify(req.body, null, 2));

  // Always acknowledge Meta quickly
  res.sendStatus(200);

  try {
    if (req.body.object !== "page") {
      return;
    }

    for (const entry of req.body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "leadgen") {
          continue;
        }

        const leadgenId = change.value?.leadgen_id;

        if (!leadgenId) {
          console.log("No leadgen_id found");
          continue;
        }

        console.log("Lead ID:", leadgenId);

        // Fetch actual lead data from Meta
        const url =
          `https://graph.facebook.com/v26.0/${leadgenId}` +
          `?fields=id,created_time,field_data` +
          `&access_token=${PAGE_ACCESS_TOKEN}`;

        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Meta API error:", errorText);
          continue;
        }

        const lead = await response.json();

        console.log("Actual lead data:");
        console.log(JSON.stringify(lead, null, 2));

        // Convert Meta field_data into simple object
        const leadData = {
          id: lead.id,
          created_time: lead.created_time,
          name: "",
          email: "",
          phone: "",
        };

        for (const field of lead.field_data || []) {
          const value = field.values?.[0] || "";

          if (field.name === "full_name") {
            leadData.name = value;
          }

          if (field.name === "email") {
            leadData.email = value;
          }

          if (field.name === "phone_number") {
            leadData.phone = value;
          }
        }

        console.log("Processed lead:");
        console.log(JSON.stringify(leadData, null, 2));

        // Send to React Native clients
        if (broadcastLead) {
          broadcastLead(leadData);
        }
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
  }
});

module.exports = {
  router,
  setBroadcastLead,
};

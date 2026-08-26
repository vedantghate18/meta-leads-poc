app.get("/privacy-policy", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Privacy Policy - Leads POC</title>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial; max-width: 800px; margin: 40px auto; padding: 20px;">
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

      <h2>Contact</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us.
      </p>
    </body>
    </html>
  `);
});

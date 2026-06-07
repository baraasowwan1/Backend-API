const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendCustomRequestEmail(requestData) {
  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM,
    subject: `New Custom Website Request from ${requestData.name}`,
    text: `
New Custom Website Request

Name: ${requestData.name}
Email: ${requestData.email}
Phone: ${requestData.phone || 'Not provided'}
Company: ${requestData.company || 'Not provided'}

Service Type: ${requestData.serviceType}
Budget: ${requestData.budget}
Timeline: ${requestData.timeline}

Description:
${requestData.description}

Additional Notes:
${requestData.additionalNotes || 'None'}

Request ID: ${requestData.requestId}
Submitted: ${new Date(requestData.createdAt).toLocaleString()}
    `,
    html: `
      <h2>New Custom Website Request</h2>
      
      <h3>Client Information</h3>
      <ul>
        <li><strong>Name:</strong> ${requestData.name}</li>
        <li><strong>Email:</strong> <a href="mailto:${requestData.email}">${requestData.email}</a></li>
        <li><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</li>
        <li><strong>Company:</strong> ${requestData.company || 'Not provided'}</li>
      </ul>

      <h3>Project Details</h3>
      <ul>
        <li><strong>Service Type:</strong> ${requestData.serviceType}</li>
        <li><strong>Budget:</strong> ${requestData.budget}</li>
        <li><strong>Timeline:</strong> ${requestData.timeline}</li>
      </ul>

      <h3>Description</h3>
      <p>${requestData.description.replace(/\n/g, '<br>')}</p>

      ${requestData.additionalNotes ? `
        <h3>Additional Notes</h3>
        <p>${requestData.additionalNotes.replace(/\n/g, '<br>')}</p>
      ` : ''}

      <hr>
      <p style="color: #666; font-size: 12px;">
        Request ID: ${requestData.requestId}<br>
        Submitted: ${new Date(requestData.createdAt).toLocaleString()}
      </p>
    `
  };

  await sgMail.send(msg);
  console.log(`✅ Email sent for request ${requestData.requestId}`);
}

module.exports = {
  sendCustomRequestEmail
};


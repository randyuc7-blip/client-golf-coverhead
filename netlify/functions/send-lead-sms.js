const twilio = require("twilio");

const parseBody = (event) => {
  if (!event.body) return {};

  try {
    return JSON.parse(event.body);
  } catch (_error) {
    return {};
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    ALERT_PHONE_NUMBER,
  } = process.env;

  if (
    !TWILIO_ACCOUNT_SID ||
    !TWILIO_AUTH_TOKEN ||
    !TWILIO_PHONE_NUMBER ||
    !ALERT_PHONE_NUMBER
  ) {
    console.error("Missing Twilio environment variables.");

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  const payload = parseBody(event);
  const name = payload.name || "Unknown";
  const tier = payload.tier || "Unknown";
  const contact = payload.contact || "Unknown";

  const message = [
    "NEW LEAD",
    "",
    `Name: ${name}`,
    `Tier: ${tier}`,
    `Contact: ${contact}`,
    "",
    "Call NOW.",
  ].join("\n");

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: ALERT_PHONE_NUMBER,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("Twilio SMS send failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SMS send failed" }),
    };
  }
};

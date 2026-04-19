const twilio = require("twilio");

const maskToken = (value) => {
  if (!value) return null;

  const visiblePart = value.slice(0, 4);
  return `${visiblePart}${"*".repeat(Math.max(value.length - 4, 0))}`;
};

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
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  console.log("Incoming request body:", event.body);

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    ALERT_PHONE_NUMBER,
  } = process.env;

  console.log("Twilio environment variables:", {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: maskToken(TWILIO_AUTH_TOKEN),
    TWILIO_PHONE_NUMBER,
    ALERT_PHONE_NUMBER,
  });

  if (
    !TWILIO_ACCOUNT_SID ||
    !TWILIO_AUTH_TOKEN ||
    !TWILIO_PHONE_NUMBER ||
    !ALERT_PHONE_NUMBER
  ) {
    console.error("Missing Twilio environment variables.");

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Server configuration error",
      }),
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

    console.log("Attempting to send Twilio SMS.", {
      to: ALERT_PHONE_NUMBER,
      from: TWILIO_PHONE_NUMBER,
      name,
      tier,
      contact,
    });

    await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: ALERT_PHONE_NUMBER,
    });

    console.log("Twilio SMS sent successfully.");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Twilio SMS send failed. Full error object:", error);
    console.error("Twilio SMS send failed. Error message:", error.message);
    console.error("Twilio SMS send failed. Error code:", error.code);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || "SMS send failed",
      }),
    };
  }
};

import { serve } from "https://deno.land/std/http/server.ts";


async function sendToZendesk(payload: any) {
  const zendeskUrl = "https://pratuproperty.zendesk.com/api/v2/tickets.json"; 
  const zendeskToken = "JbVw2mcj4eeWF0N2mvC2d6rPgBlBDbMSlEwlJtMw"; 

  const response = await fetch(zendeskUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${zendeskToken}`,
    },
    body: JSON.stringify({
      ticket: {
        subject: "New Slack Ticket",
        description: payload.text || "No description",
        priority: "normal",
      },
    }),
  });

  return response.json();
}

// Slack verification endpoint (for events)
async function handleSlackEvents(request: Request) {
  const data = await request.json();
  
  const zendeskResponse = await sendToZendesk(data);

  return new Response(JSON.stringify(zendeskResponse), { status: 200 });
}


async function handleSlackVerification(request: Request) {
  try {
    // Parse the incoming JSON request body
    const data = await request.json();

    // Verify if the request is coming from Slack by matching the token
    if (data.token !== SLACK_VERIFICATION_TOKEN) {
      console.log("Invalid token");
      return new Response("Invalid token", { status: 400 });
    }

    // Extract the challenge parameter
    const challenge = data.challenge;
    
    if (challenge) {
      // Respond with the challenge value to complete the URL verification
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      return new Response("Challenge not found", { status: 400 });
    }
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response("Error processing request", { status: 500 });
  }
}

// Main request handler
async function handleRequest(request: Request) {
  const url = new URL(request.url);

  // Slack verification endpoint (URL verification)
  if (url.pathname === "/slack/verify") {
    return handleSlackVerification(request);
  }

  return new Response("Not Found", { status: 404 });
}

// Start the server
serve(handleRequest);

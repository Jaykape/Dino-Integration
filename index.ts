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
  const urlParams = new URLSearchParams(new URL(request.url).search);
  const challenge = urlParams.get("challenge");
  
  // Respond with the challenge value as Slack expects
  if (challenge) {
    return new Response(JSON.stringify({ challenge }), { status: 200 });
  } else {
    return new Response("Challenge not found", { status: 400 });
  }
}

// Main request handler
async function handleRequest(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === "/slack-events") {
    return handleSlackEvents(request);
  }

  if (url.pathname === "/slack/verify") {
    return handleSlackVerification(request);
  }

  return new Response("Not Found", { status: 404 });
}

// Start the server
serve(handleRequest);

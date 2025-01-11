// server.ts

const dctUser={"U05RRKK69JP":"Josh"};

const ZENDESK_SUBDOMAIN = "pratuproperty"; 
const ZENDESK_EMAIL = "jay@pratuproperty.com/token"; 
const ZENDESK_API_TOKEN = "Ol0lZCABheMCVaTlkO4wKspSDbnaK0Coq9n6NvsE"; 
const TICKET_FORM_ID = 11704013998479; 
const auth = btoa(`${ZENDESK_EMAIL}:${ZENDESK_API_TOKEN}`);

addEventListener("fetch", async (event) => {
  const request = event.request;
  
  // Log the request method and URL
  console.log(`${request.method} ${request.url}`);

  // Check if the content type is JSON
  const contentType = request.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    try {
      const payload = await request.json(); // Parse the JSON body
      console.log("Request Payload:", payload); // Log the payload

      
      const inputvalues = payload.event.inputs;
      const requester = inputvalues.User;
      const text = inputvalues.String;
      

      console.log("Requester: ", dctUser[requester], "want", text);
      
      const ticketData = {
  ticket: {
    subject: "Static Ticket Submission",
    comment: { body: "This is a static ticket created by a script." },
    requester: {
      name: "Jay",
      email: "jay@pratuproperty.com", // Replace with a valid requester email
    },
    ticket_form_id: TICKET_FORM_ID,
    "custom_fields": [{"Requester": 25356371, "What they want": "I bought it at Buy More."}]
  },
};
      
      const response = await fetch(zendeskUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Zendesk ticket created successfully:", result);
    } else {
      const errorText = await response.text();
      console.error("Failed to create Zendesk ticket:", errorText);
    }
      
      
      
      
      
      
      
      
      
      
      const readypayload = payload.challenge;
  // Respond to the request
  event.respondWith(
    new Response(readypayload, {
      status: 200,
      headers: {
        "content-type": "text/plain",
      },
    })
  );
      
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  }

 
});

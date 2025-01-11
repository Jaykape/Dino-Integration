// server.ts

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
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
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
});

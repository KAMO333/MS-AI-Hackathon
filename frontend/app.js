// Client data (will be populated from backend)
let client1 = {};

// Display client data on page load
document.addEventListener("DOMContentLoaded", async function () {
  await fetchClientData();
  displayClientData();

  // Set up event listener for send button
  document
    .getElementById("send-button")
    .addEventListener("click", sendMessageToAI);
});

async function fetchClientData() {
  try {
    const response = await fetch("/api/client");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    client1 = await response.json();
  } catch (error) {
    console.error("Error fetching client data:", error);
  }
}

function displayClientData() {
  const clientDataDiv = document.getElementById("client-data");
  clientDataDiv.innerHTML = `
        <div class="client-data-item"><strong>Name:</strong> ${client1.name}</div>
        <div class="client-data-item"><strong>Surname:</strong> ${client1.surname}</div>
        <div class="client-data-item"><strong>Age:</strong> ${client1.age}</div>
        <div class="client-data-item"><strong>Location:</strong> ${client1.location}</div>
        <div class="client-data-item"><strong>Issue:</strong> ${client1.issue}</div>
    `;
}

async function sendMessageToAI() {
  const userMessage = document.getElementById("user-message").value.trim();
  if (!userMessage) {
    alert("Please enter a message to send to the AI");
    return;
  }

  const responseDiv = document.getElementById("ai-response");
  responseDiv.innerHTML = '<p class="loading">Waiting for AI response...</p>';

  const sendButton = document.getElementById("send-button");
  sendButton.disabled = true;
  sendButton.textContent = "Sending...";

  try {
    const response = await fetch("/api/send-to-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Display the AI response
    responseDiv.innerHTML = `<p>${data.response.replace(/\n/g, "<br>")}</p>`;

    // Update client data with response (if needed)
    if (data.clientData) {
      client1 = data.clientData;
      displayClientData();
    }
  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerHTML = `<p class="error">Error getting response: ${error.message}</p>`;
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send to AI";
  }
}

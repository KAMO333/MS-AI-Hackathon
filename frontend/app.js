let client1 = {};

// Fetch and display client data on page load
// Fetch and display client data on page load
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/api/client");
    if (!response.ok) throw new Error("Failed to load client data");

    const latestClient = await response.json();

    // If we have data, fill the form and the "Saved" area
    if (latestClient.id) {
      populateUI(latestClient);
    }
  } catch (error) {
    console.error("Error loading client data:", error);
  }

  document
    .getElementById("send-button")
    .addEventListener("click", sendMessageToAI);
});

// New Helper function to update both the Form and the Saved Preview
function populateUI(data) {
  // 1. Fill the Form fields (so the social worker can continue where they left off)
  document.getElementById("client-name").value = data.name || "";
  document.getElementById("client-surname").value = data.surname || "";
  document.getElementById("client-age").value = data.age || "";
  document.getElementById("client-location").value = data.location || "";
  document.getElementById("client-issue").value = data.issue || "";

  // 2. Update the "Last Saved Session" area
  document.getElementById("saved-client-info").classList.remove("hidden");
  document.getElementById("db-id").textContent = data.id;
  document.getElementById("db-name").textContent =
    `${data.name} ${data.surname}`;
  document.getElementById("db-location").textContent = data.location;
  document.getElementById("db-age").textContent = data.age;

  // 3. Show the AI response if it exists
  const responseDiv = document.getElementById("ai-response");
  if (data.response) {
    responseDiv.innerHTML = `<p>${data.response.replace(/\n/g, "<br>")}</p>`;
  }
}

async function sendMessageToAI() {
  const currentClient = {
    name: document.getElementById("client-name").value.trim(),
    surname: document.getElementById("client-surname").value.trim(),
    age: document.getElementById("client-age").value.trim(),
    location: document.getElementById("client-location").value.trim(),
    issue: document.getElementById("client-issue").value.trim(),
  };

  const userMessage = document.getElementById("user-message").value.trim();
  const sendButton = document.getElementById("send-button");
  const responseDiv = document.getElementById("ai-response");

  if (!currentClient.name || !userMessage) {
    alert("Please fill in the client name and your message.");
    return;
  }

  responseDiv.innerHTML = '<p class="loading">Consulting AI Assistant...</p>';
  sendButton.disabled = true;
  sendButton.textContent = "Sending...";

  try {
    const response = await fetch("/api/send-to-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, clientData: currentClient }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    // Update the UI using our helper with the fresh data from the DB
    populateUI({ ...currentClient, id: data.id, response: data.response });

    // Clear the message box for the next input
    document.getElementById("user-message").value = "";
  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send to AI";
  }
}

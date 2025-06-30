function locateSeat() {
  const pnr = document.getElementById("pnr").value;
  if (pnr === "1234567890") {
    document.getElementById("seatResult").innerText = "Coach: B1, Seat: 45 (Window)";
  } else {
    document.getElementById("seatResult").innerText = "PNR not found.";
  }
}

function startVoiceAssistant() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = document.getElementById("lang").value;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    document.getElementById("voiceOutput").innerText = "You said: " + text;

    if (text.includes("seat")) locateSeat();
    else if (text.includes("platform")) checkPlatform();
    else if (text.includes("help")) sendEmergency();
    else document.getElementById("voiceOutput").innerText += " (I didn't understand.)";
  };

  recognition.start();
}

function checkPlatform() {
  const docRef = db.collection("train_status").doc("express101");
  docRef.get().then((doc) => {
    if (doc.exists) {
      document.getElementById("platformStatus").innerText = "Platform changed to " + doc.data().platform;
    } else {
      document.getElementById("platformStatus").innerText = "Train data not found.";
    }
  });
}

function sendEmergency() {
  db.collection("emergencies").add({
    message: "Help requested by passenger",
    time: new Date()
  }).then(() => {
    document.getElementById("emergencyMsg").innerText = "Emergency sent!";
  }).catch(() => {
    document.getElementById("emergencyMsg").innerText = "Failed to send!";
  });
}
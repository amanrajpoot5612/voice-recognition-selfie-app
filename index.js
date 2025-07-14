// Speech function
const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
};

// Start speech recognition
const startRecognition = () => {
    console.log("Speech Recognition called");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported in your borwser");
    console.log("Speech recognition supported");

    const recognition = new SpeechRecognition();
    console.log("New recognition created");
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
        const transcript = document.getElementById("speechText").textContent = event.results[0][0].transcript.toLowerCase();
        console.log("Speech recognition converted to text");

        if (
            transcript.includes("take selfie") ||
            transcript.includes("take my selfie") ||
            transcript.includes("selfie") ||
            transcript.includes("capture") ||
            transcript.includes("photo") ||
            transcript.includes("click photo")
        ) {
            console.log("Taking photo");
            startCamera();
        }
    }
    recognition.start();
}

const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById("camera");
        videoElement.srcObject = stream;
        console.log("Camera stream started");


        videoElement.onloadedmetadata = () => {
            videoElement.play();

            console.log("🎥 Video metadata loaded");
        }

        speak("Taking your selfie in 3 seconds")

        setTimeout(() => {
            capturePhoto();
        }, 3000);

    } catch (error) {
        console.log("Error accessing camera");
        alert("Camera access denied or not available")
    }
}

const capturePhoto = () => {
    const video = document.getElementById("camera");
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log("Capturing photo with size:", video.videoWidth, "x", video.videoHeight);

    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/jpeg");
    img.alt = "Captured selfie";
    img.style.width = "200px";
    console.log("Image created with src:", img.src);

    document.querySelector(".saved").appendChild(img);
    console.log("📸 Photo captured and saved");

    const a = document.createElement("a");
    a.href = img.src;
    a.download = "selfie.jpg";
    a.click();
    console.log("Selfie downloaded");



    // const video = document.getElementById("camera");
    const stream = video.srcObject;

    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        console.log("Camera stopped");

    }

}


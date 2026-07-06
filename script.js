let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1.5;
    text_speak.volume = 1;
    text_speak.lang = "en-US";

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning");
    }
    else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon");
    }
    else { speak("Good Evening"); }
}
// window.addEventListener("load", () => {
//     wishMe();
// })

let speechRecongnition = window.speechRecongnition || window.webkitSpeechRecognition;
let recognition = new speechRecongnition();
let listeningTimer = null;

recognition.onresult = (event) => {
    // clear any fallback timer — we got speech
    if (listeningTimer) { clearTimeout(listeningTimer); listeningTimer = null; }
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript);
}

// When recognition ends (no-speech, timeout, or normal end), restore UI
recognition.onend = () => {
    btn.style.display = "flex";
    voice.style.display = "none";
    if (listeningTimer) { clearTimeout(listeningTimer); listeningTimer = null; }
};

recognition.onerror = (event) => {
    // restore UI on error
    btn.style.display = "flex";
    voice.style.display = "none";
    console.warn("Speech recognition error:", event.error || event);
    if (listeningTimer) { clearTimeout(listeningTimer); listeningTimer = null; }
};

btn.addEventListener("click", () => {
    try {
        recognition.start();
    } catch (e) {
        console.warn("recognition.start() error:", e);
    }
    btn.style.display = "none";
    voice.style.display = "block";

    // Fallback: if user doesn't speak within 8s, stop recognition and restore button
    if (listeningTimer) { clearTimeout(listeningTimer); }
    listeningTimer = setTimeout(() => {
        try { recognition.stop(); } catch (e) { /* ignore */ }
        // onend handler will restore UI
    }, 8000);
})

function takeCommand(message) {
    btn.style.display = "flex"
    voice.style.display = "none"
    if (message.includes("Hello") || message.includes("Hi") || message.includes("Hey")) {
        speak("Hello, I'm Robo, How can I help you?");
    }
    else if (message.includes("Who are you")) {
        speak("I am virtual assistant, created by Amit Sir.");
    }
    else if (message.includes("Open YouTube")) {
        speak("opening YouTube...");
        window.open("https://youtube.com/","_blank");
    }
    else if (message.includes("Open LinkedIn")) {
        speak("opening LinkedIn...");
        window.open("https://linkedin.com/","_blank");
    }
    else if (message.includes("Open GitHub")) {
        speak("opening GitHub...");
        window.open("https://github.com/","_blank");
    }
    else if (message.includes("Open Google")) {
        speak("opening Google...");
        window.open("https://google.com/","_blank");
    }
    else if (message.includes("Open Calculator")) {
        speak("opening Calculator...");
        window.open("calculator://");
    }
    else if (message.includes("Open WhatsApp")) {
        speak("opening WhatsApp...");
        window.open("https://whatsapp.com/","_blank");
    }
    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour:"numeric",minute:"numeric"})
        speak(time);
    }
    else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day:"numeric",month:"short",year:"numeric"})
        speak(date);
    }
    else {
        speak(`This is what I found on the internet regarding ${message.replace("Robo", "") || message.replace("Robot", "")}`);
        window.open(`https://www.google.com/search?q= ${message.replace("Robo", "") || message.replace("Robot", "")}`);
    }
}



// btn.addEventListener("click", function(){
//     speak("Hello, I am Robo, your virtual assistant");
// });
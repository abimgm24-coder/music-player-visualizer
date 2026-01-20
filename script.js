// ===== BASIC ELEMENTS =====
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const songName = document.getElementById("songName");

// ===== PLAYLIST =====
const songs = [
  "songs/song1.mp3",
  "songs/song2.mp3",
  "songs/song3.mp3"
];

let currentSong = 0;

// ===== LOAD SONG =====
function loadSong(index) {
  audio.pause();
  audio.src = songs[index];
  audio.load();

  songName.innerText = "Playing: " + songs[index].split("/")[1];

  audio.oncanplay = () => {
    audio.play();
  };
}

// ===== CONTROLS =====
function playMusic() {
  audio.play();
}

function pauseMusic() {
  audio.pause();
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
}

// ===== PROGRESS BAR =====
audio.addEv
// ===== AUDIO VISUALIZER =====
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Create Audio Context & Analyser
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

source.connect(analyser);
analyser.connect(audioContext.destination);

// FFT Size
analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = "lime"; // bars color
    ctx.fillRect(
      i * barWidth,
      canvas.height - barHeight,
      barWidth - 2,
      barHeight
    );
  }
}

// Start visualizer on audio play
audio.addEventListener("play", () => {
  audioContext.resume();
  drawVisualizer();
});
// ===== PLAY FROM PLAYLIST =====
const playlistItems = document.querySelectorAll("#playlist li");

function updatePlaylistHighlight() {
  playlistItems.forEach((item, index) => {
    if(index === currentSong){
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function playFromList(index) {
  currentSong = index;
  loadSong(currentSong);
  updatePlaylistHighlight();
}

// Update highlight on load
updatePlaylistHighlight();

// Auto next song when current ends
audio.addEventListener("ended", () => {
  nextSong();
  updatePlaylistHighlight();
});

// Also update highlight on next/prev buttons
function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  updatePlaylistHighlight();
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  updatePlaylistHighlight();
}
const volumeSlider = document.getElementById("volume");
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});
const timeDisplay = document.getElementById("timeDisplay");

audio.addEventListener("timeupdate", () => {
  const current = formatTime(audio.currentTime);
  const duration = formatTime(audio.duration);
  timeDisplay.innerText = `${current} / ${duration}`;
});

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

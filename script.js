const tracks = [
    { title: 'Misma Void', artist: 'P4XT0N Series', src: 'mismavoid.mp3', duration: 180 }, 
    { title: 'Infinitus Galaxy', artist: 'P4XT0N Series', src: 'infinitusgalaxy.mp3', duration: 210 }, 
    { title: 'Battle of the Elements', artist: 'P4XT0N Series', src: 'bote.mp3', duration: 240 }, 
];

let currentTrackIndex = 0;
let isPlaying = false;
let currentTime = 0; 
let simulationInterval = null; 

let currentVolume = 75; 
let lastVolume = 75; 
let isMuted = false;

const trackTitleElement = document.getElementById('track-title');
const trackArtistElement = document.getElementById('track-artist');
const prevBtn = document.getElementById('prev-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const playlistUl = document.getElementById('playlist-ul');

const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const currentTimeElement = document.getElementById('current-time');
const totalTimeElement = document.getElementById('total-time');

const volumeBtn = document.getElementById('volume-btn');
const volumeSlider = document.getElementById('volume-slider');

const playIcon = `
    <svg viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
    </svg>
`;
const pauseIcon = `
    <svg viewBox="0 0 24 24">
        <path d="M6 6h4v12H6zm8 0h4v12h-4z"/>
    </svg>
`;

const volumeHighIcon = `
    <svg viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
`;
const volumeLowIcon = `
     <svg viewBox="0 0 24 24">
        <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
    </svg>
`;
const volumeMuteIcon = `
    <svg viewBox="0 0 24 24">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-3.01-7.86-7-8.77v2.06c2.89.81 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.72-1.88L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
`;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${minutes}:${paddedSeconds}`;
}

function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;

    currentTrackIndex = index;
    const track = tracks[currentTrackIndex];

    trackTitleElement.textContent = track.title;
    trackArtistElement.textContent = track.artist;

    currentTime = 0; 
    currentTimeElement.textContent = formatTime(currentTime);
    totalTimeElement.textContent = formatTime(track.duration);
    progressFill.style.width = '0%';

    updatePlaylistHighlight();

    if (isPlaying) {
         clearInterval(simulationInterval);
         startSimulation();
         updatePlayPauseButton();
    } else {
         updatePlayPauseButton();
    }
}

function updatePlayPauseButton() {
    playPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
}

function startSimulation() {
    simulationInterval = setInterval(() => {
        currentTime++;
        if (currentTime <= tracks[currentTrackIndex].duration) {
            updateProgressBar();
            currentTimeElement.textContent = formatTime(currentTime);
        } else {
            clearInterval(simulationInterval);
            isPlaying = false;
            updatePlayPauseButton();
        }
    }, 1000); 
}

function stopSimulation() {
    clearInterval(simulationInterval);
    simulationInterval = null;
}

function playPause() {
    isPlaying = !isPlaying;
    updatePlayPauseButton();

    if (isPlaying) {
        if (currentTime >= tracks[currentTrackIndex].duration) {
             currentTime = 0;
             updateProgressBar();
             currentTimeElement.textContent = formatTime(currentTime);
        }
        startSimulation();
        console.log('Playing', tracks[currentTrackIndex].title);
    } else {
        stopSimulation();
        console.log('Paused', tracks[currentTrackIndex].title);
    }
}

function nextTrack() {
    stopSimulation();
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    console.log('Next track');
}

function prevTrack() {
    stopSimulation();
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    console.log('Previous track');
}

function renderPlaylist() {
    playlistUl.innerHTML = ''; 
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="track-title">${track.title}</span> - <span class="track-artist">${track.artist}</span>`;
        li.dataset.index = index;
        li.addEventListener('click', () => {
            stopSimulation();
            loadTrack(index);
             if (!isPlaying) { 
                 playPause();
             } else { 
                 if (!simulationInterval) {
                     startSimulation();
                 }
             }
        });
        playlistUl.appendChild(li);
    });
    updatePlaylistHighlight(); 
}

function updatePlaylistHighlight() {
     playlistUl.querySelectorAll('li').forEach((li, index) => {
        if (index === currentTrackIndex) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}

function updateProgressBar() {
    const trackDuration = tracks[currentTrackIndex].duration;
    if (trackDuration > 0) {
        const progressPercentage = (currentTime / trackDuration) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
}

progressBar.addEventListener('click', (e) => {
    const trackDuration = tracks[currentTrackIndex].duration;
    if (trackDuration === 0) return; 

    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const barWidth = progressBar.offsetWidth;
    const seekPercentage = clickPosition / barWidth;

    currentTime = Math.min(trackDuration, Math.max(0, seekPercentage * trackDuration));

    currentTimeElement.textContent = formatTime(currentTime);
    updateProgressBar();

    if (isPlaying) {
        stopSimulation();
        startSimulation();
    } 
    console.log(`Seeked to ${formatTime(currentTime)}`);
});

function updateVolumeIcon() {
    volumeBtn.innerHTML = ''; 
    const volume = isMuted ? 0 : currentVolume; 

    let icon;
    if (volume === 0) {
        icon = volumeMuteIcon;
    } else if (volume > 50) {
        icon = volumeHighIcon;
    } else {
        icon = volumeLowIcon;
    }
    volumeBtn.innerHTML = icon;
}

function updateVolumeSliderBackground() {
     // Update the background gradient to show fill level
     const percentage = isMuted ? 0 : currentVolume;
     volumeSlider.style.background = `linear-gradient(to right, var(--accent-color) ${percentage}%, var(--border-color) ${percentage}%)`;
     // Re-apply border after setting background
     volumeSlider.style.border = '1px solid var(--border-color)';
}

function handleVolumeChange() {
    currentVolume = parseInt(volumeSlider.value, 10);
    isMuted = false; 
    lastVolume = currentVolume; 
    updateVolumeIcon();
    updateVolumeSliderBackground();
    console.log('Volume changed to', currentVolume);
}

function toggleMute() {
    isMuted = !isMuted;

    if (isMuted) {
        // Store current volume before muting
        lastVolume = currentVolume > 0 ? currentVolume : 75; // Use 75 as a default if volume was 0 when muted
        volumeSlider.value = 0;
        currentVolume = 0;
        updateVolumeSliderBackground(); 
    } else {
        // Restore volume, ensure it's not 0 if lastVolume was 0
        currentVolume = lastVolume > 0 ? lastVolume : 50; // Restore to a default if lastVolume was 0
        volumeSlider.value = currentVolume;
        updateVolumeSliderBackground(); 
    }
     updateVolumeIcon(); 
     console.log(isMuted ? 'Muted' : `Unmuted, volume: ${currentVolume}`);
}

prevBtn.addEventListener('click', prevTrack);
playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextTrack);
volumeBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', handleVolumeChange); 

renderPlaylist();
loadTrack(currentTrackIndex); 

// Initial setup for volume slider and icon
volumeSlider.value = currentVolume; 
updateVolumeIcon(); 
updateVolumeSliderBackground();
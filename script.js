const tracks = [
    { title: 'Misma Void', artist: 'P4XT0N Series', src: 'mismavoid.mp3' },
    { title: 'Infinitus Galaxy', artist: 'P4XT0N Series', src: 'infinitusgalaxy.mp3' },
    { title: 'Battle of the Elements', artist: 'P4XT0N Series', src: 'bote.mp3' },
];

let currentTrackIndex = 0;
let isPlaying = false;

let currentVolume = 100; 
let lastVolume = 100; 
let isMuted = false;

const audio = new Audio(); 

const trackTitleElement = document.getElementById('track-title');
const trackArtistElement = document.getElementById('track-artist');
const prevBtn = document.getElementById('prev-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const playlistUl = document.getElementById('playlist-ul');
const modeBtn = document.getElementById('mode-btn'); 
const downloadBtn = document.getElementById('download-btn');

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
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-3.01-7.86-7-8.77v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c1.38-.31 2.63-.95 3.72-1.88L19.73 21 21 19.73l-9-9L4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42-.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.72-1.88L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
`;

const downloadIcon = `
    <svg viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
`;

// Define playback modes
const PlaybackModes = {
    NORMAL: 'Normal',
    LOOP: 'Loop', // Loop current track
    RANDOM: 'Random', // Play random track after current ends
    STOP: 'Stop' // Stop after current track ends
};

let currentMode = PlaybackModes.NORMAL; // Initial mode

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

    audio.src = track.src;
    audio.load(); 

    currentTimeElement.textContent = '0:00';
    totalTimeElement.textContent = '0:00';
    progressFill.style.width = '0%';


    updatePlaylistHighlight();
    updatePlayPauseButton(); 
    updateDownloadButton(); // Update download button state

    audio.addEventListener('loadedmetadata', () => {
        totalTimeElement.textContent = formatTime(audio.duration);
        currentTimeElement.textContent = formatTime(0);
        progressFill.style.width = '0%';
    }, { once: true }); 

    if (isPlaying) {
        audio.play();
    }
}

function updatePlayPauseButton() {
    playPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
}

function playPause() {
    if (isPlaying) {
        audio.pause();
        console.log('Paused', tracks[currentTrackIndex].title);
    } else {
        audio.play();
        console.log('Playing', tracks[currentTrackIndex].title);
    }
}

function nextTrack(isRandom = false) {
    if (tracks.length === 0) return;

    let nextIndex = currentTrackIndex;

    if (isRandom) {
        if (tracks.length <= 1) {
             // If only one track, just play it again (or do nothing if already playing)
            if (isPlaying) {
                 audio.currentTime = 0;
                 audio.play();
            } else {
                 loadTrack(currentTrackIndex);
            }
            return; // Stay on the current track and handle loop/stop via ended listener
        }
        // Pick a random index different from the current one
        while (nextIndex === currentTrackIndex) {
            nextIndex = Math.floor(Math.random() * tracks.length);
        }
    } else {
        // Normal mode or loop mode (loop handled in 'ended')
        nextIndex = (currentTrackIndex + 1) % tracks.length;
    }

    loadTrack(nextIndex);
     // Only auto-play if it was playing before the track ended
    if (isPlaying) { // isPlaying is only false after audio.pause() or ended handler sets it
         audio.play();
    }
    console.log('Moving to track index', nextIndex);
}

function prevTrack() {
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
            const clickedIndex = parseInt(li.dataset.index, 10);
            const wasPlaying = isPlaying; 

            if (clickedIndex === currentTrackIndex) {
                playPause();
            } else {
                loadTrack(clickedIndex);
                audio.play(); 
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
    const trackDuration = audio.duration;
    const currentTime = audio.currentTime;

    if (!isNaN(trackDuration) && trackDuration > 0) {
        const progressPercentage = (currentTime / trackDuration) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    } else {
         progressFill.style.width = '0%';
    }
}

progressBar.addEventListener('click', (e) => {
    const trackDuration = audio.duration;
    if (isNaN(trackDuration) || trackDuration <= 0) return;

    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const barWidth = progressBar.offsetWidth;
    const seekPercentage = clickPosition / barWidth;

    const seekTime = Math.min(trackDuration, Math.max(0, seekPercentage * trackDuration));
    audio.currentTime = seekTime; 

    console.log(`Seeked to ${formatTime(seekTime)}`);
});

function updateVolumeIcon() {
    volumeBtn.innerHTML = '';
    const volume = isMuted ? 0 : audio.volume * 100; 

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
     const percentage = isMuted ? 0 : audio.volume * 100; 
     volumeSlider.style.background = `linear-gradient(to right, var(--accent-color) ${percentage}%, var(--border-color) ${percentage}%)`;
     volumeSlider.style.border = '1px solid var(--border-color)';
}

function handleVolumeChange() {
    const sliderValue = parseInt(volumeSlider.value, 10);
    audio.volume = sliderValue / 100; 

    currentVolume = audio.volume * 100; 
    isMuted = audio.volume === 0; 

    if (!isMuted) {
         lastVolume = currentVolume; 
    }

    updateVolumeIcon();
    updateVolumeSliderBackground();
    console.log('Volume changed to', currentVolume);
}

function toggleMute() {
    isMuted = !isMuted;

    if (isMuted) {
        lastVolume = audio.volume * 100 > 0 ? audio.volume * 100 : 100;
        audio.muted = true; 
        volumeSlider.value = 0;
    } else {
        const restoredVolume = lastVolume > 0 ? lastVolume : 100;
        audio.muted = false;
        audio.volume = restoredVolume / 100; 
        volumeSlider.value = restoredVolume;
    }
    currentVolume = audio.volume * 100; 

    updateVolumeIcon();
    updateVolumeSliderBackground();
    console.log(isMuted ? 'Muted' : `Unmuted, volume: ${currentVolume}`);
}

function updateModeButton() {
    modeBtn.textContent = currentMode.charAt(0); // Display first letter
    modeBtn.title = `Playback Mode: ${currentMode}`;
    // Optional: Add visual styling based on mode
    // modeBtn.classList.remove('mode-normal', 'mode-loop', 'mode-random', 'mode-stop');
    // modeBtn.classList.add(`mode-${currentMode.toLowerCase()}`);
}

function cyclePlaybackMode() {
    const modes = Object.values(PlaybackModes);
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    currentMode = modes[nextIndex];
    updateModeButton();
    console.log('Playback mode changed to', currentMode);
}

function updateDownloadButton() {
     // For now, just ensure the icon is there.
     // We could potentially disable it if there are no tracks, but that's already handled by tracks.length check.
     downloadBtn.innerHTML = downloadIcon;
     // The download logic will get the current track info when clicked
}

function downloadCurrentTrack() {
     if (tracks.length === 0) {
         console.log("No tracks to download.");
         return;
     }
     const track = tracks[currentTrackIndex];
     const link = document.createElement('a');
     link.href = track.src;
     // Construct the filename using the track title and add .mp3 extension
     // Replace characters that might be problematic in filenames (optional but good practice)
     const cleanTitle = track.title.replace(/[^\w\s.-]/g, '').trim();
     link.download = `${cleanTitle}.mp3`;
     document.body.appendChild(link); // Append to body is necessary for Firefox
     link.click(); // Simulate click
     document.body.removeChild(link); // Clean up the temporary link
     console.log(`Attempting to download: ${link.download} from ${link.href}`);
}

audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayPauseButton();
    console.log('Audio playback started');
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayPauseButton();
    console.log('Audio playback paused');
});

audio.addEventListener('ended', () => {
    console.log('Track ended. Current mode:', currentMode);
    switch (currentMode) {
        case PlaybackModes.NORMAL:
            nextTrack(); // Play the next track in sequence
            break;
        case PlaybackModes.LOOP:
            audio.currentTime = 0; // Reset time to start
            audio.play(); // Play the current track again
            console.log('Looping track');
            break;
        case PlaybackModes.RANDOM:
            nextTrack(true); // Play a random track
            break;
        case PlaybackModes.STOP:
            isPlaying = false; // Set isPlaying to false
            updatePlayPauseButton(); // Update play/pause button to show play icon
            audio.currentTime = 0; // Optionally reset time and progress bar
            updateProgressBar();
            console.log('Stopping after current track');
            // Do not load/play next track
            break;
    }
});

audio.addEventListener('timeupdate', () => {
    updateProgressBar();
    currentTimeElement.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('volumechange', () => {
    const newVolume = audio.volume * 100;
    const newIsMuted = audio.muted;

    if (currentVolume !== newVolume || isMuted !== newIsMuted) {
        currentVolume = newVolume;
        isMuted = newIsMuted;
        volumeSlider.value = isMuted ? 0 : currentVolume;
        updateVolumeIcon();
        updateVolumeSliderBackground();
    }
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeElement.textContent = formatTime(audio.duration);
    currentTimeElement.textContent = formatTime(0);
    progressFill.style.width = '0%';
});

prevBtn.addEventListener('click', prevTrack);
playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', () => nextTrack(currentMode === PlaybackModes.RANDOM)); // Next button plays next in sequence UNLESS in Random mode
volumeBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', handleVolumeChange);
modeBtn.addEventListener('click', cyclePlaybackMode); // Add event listener for mode button
downloadBtn.addEventListener('click', downloadCurrentTrack); // Add event listener for download button

renderPlaylist();
loadTrack(currentTrackIndex); // Load the initial track

volumeSlider.value = currentVolume;
audio.volume = currentVolume / 100; 
updateVolumeIcon();
updateVolumeSliderBackground();
updateModeButton(); // Initialize mode button display
updateDownloadButton(); // Initialize download button display

const tracks = [
    { title: 'Misma Void', artist: 'P4XT0N Series', src: 'mismavoid.mp3' },
    { title: 'Infinitus Galaxy', artist: 'P4XT0N Series', src: 'infinitusgalaxy.mp3' },
    { title: 'Battle of the Elements', artist: 'P4XT0N Series', src: 'bote.mp3' },
    { title: 'Void of 333', artist: 'P4XT0N Series', src: 'Void%20of%20333.mp3' },
    { title: 'Vengeful Symphony', artist: 'P4XT0N Series', src: 'Vengeful%20Symphony.mp3' },
    { title: 'Underworld Ruler', artist: 'P4XT0N Series', src: 'Underworld%20Ruler.mp3' },
    { title: 'The Red Dust', artist: 'P4XT0N Series', src: 'The%20Red%20Dust.mp3' },
    { title: 'Silence Shadows', artist: 'P4XT0N Series', src: 'Slience%20Shadows.mp3' },
    { title: 'Screams of Darkness', artist: 'P4XT0N Series', src: 'Screams%20of%20Darkness.mp3' },
    { title: 'Into the Abyss', artist: 'P4XT0N Series', src: 'Into%20the%20Abyss.mp3' },
    { title: 'In the other side of the Universe', artist: 'P4XT0N Series', src: 'In%20the%20other%20side%20of%20the%20Universe.mp3' },
    // Add new tracks below
    { title: 'Feu de Guitare et Piano', artist: 'P4XT0N Series', src: 'Feu%20de%20Guitare%20et%20Piano.mp3' },
    { title: 'End of the World Stride', artist: 'P4XT0N Series', src: 'End%20of%20the%20World%20Stride.mp3' },
    { title: 'End of the Misma', artist: 'P4XT0N Series', src: 'End%20of%20the%20Misma.mp3' },
    { title: 'Electric Dreams', artist: 'P4XT0N Series', src: 'Electric%20Dreams.mp3' },
    { title: 'Dance of the Dead', artist: 'P4XT0N Series', src: 'Dance%20of%20the%20Dead.mp3' },
    { title: 'Chasing Shadows', artist: 'P4XT0N Series', src: 'Chasing%20Shadows.mp3' },
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
const currentClockElement = document.getElementById('current-clock');

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
    if (tracks.length === 0) return;
    if (index < 0 || index >= tracks.length) {
        index = 0; // Loop back to the start or handle boundary
    }

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

    // Ensure metadata is loaded for duration and time updates
    const onLoadedMetadata = () => {
        totalTimeElement.textContent = formatTime(audio.duration);
        currentTimeElement.textContent = formatTime(0);
        progressFill.style.width = '0%';
        audio.removeEventListener('loadedmetadata', onLoadedMetadata); // Remove listener after it fires
    };
    audio.addEventListener('loadedmetadata', onLoadedMetadata);


    // If a track was previously playing, attempt to play the new one
    // isPlaying state is updated by the 'play' and 'pause' audio events
    // We only want to auto-play if the player was active before loading the new track
    // This logic is handled better in the playPause function or when calling loadTrack
    // For now, the logic below assumes we *should* play if the track was loaded by user interaction (click)
    // or if the player was in a playing state when the track ended.
    // A simpler approach is to just load and let the play/pause state control playback START.
    // However, the previous logic kept isPlaying true across loads if it was true. Let's stick to that for now.
     if (isPlaying) {
         audio.play().catch(error => {
            console.log("Autoplay prevented:", error);
            // User might need to click play manually after a load if autoplay is blocked
            isPlaying = false; // Revert state if autoplay fails
            updatePlayPauseButton();
        });
     } else {
         // If not playing, just load the track and update the button to 'play'
         updatePlayPauseButton();
     }
}

function updatePlayPauseButton() {
    playPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
}

function playPause() {
    if (isPlaying) {
        audio.pause();
        console.log('Paused', tracks[currentTrackIndex].title);
        // isPlaying is set to false by the audio 'pause' event listener
    } else {
         // When playing, we need to handle the potential for the audio not being loaded yet,
         // or needing user interaction. audio.play() returns a Promise.
         audio.play().then(() => {
             console.log('Playing', tracks[currentTrackIndex].title);
             // isPlaying is set to true by the audio 'play' event listener
         }).catch(error => {
             console.log("Playback failed:", error);
             // Handle cases like user gesture requirement
             isPlaying = false; // Ensure state is correct if play fails
             updatePlayPauseButton();
         });
    }
}

function nextTrack(isRandom = false) {
    if (tracks.length === 0) return;

    let nextIndex = currentTrackIndex;

    if (isRandom) {
        if (tracks.length <= 1) {
             // If only one track, just play it again (or do nothing if already playing)
             // The 'ended' listener with LOOP mode handles the single track repeat logic better.
             // If random is selected with only one track, it's essentially loop.
             // For true random, we need at least 2 tracks.
            if (tracks.length === 1) {
                 audio.currentTime = 0; // Reset to start for replay
                 audio.play();
                 console.log('Only one track, looping.');
                 return; // Stay on the current track and let 'ended' handle the loop
            }

            // Pick a random index different from the current one
            while (nextIndex === currentTrackIndex) {
                nextIndex = Math.floor(Math.random() * tracks.length);
            }
        } else {
            // Pick a random index different from the current one
            while (nextIndex === currentTrackIndex) {
                nextIndex = Math.floor(Math.random() * tracks.length);
            }
        }
    } else {
        // Normal mode or loop mode (loop handled in 'ended')
        nextIndex = (currentTrackIndex + 1) % tracks.length;
    }

    // Load and potentially play the next track.
    // The loadTrack function handles starting playback if isPlaying is true.
    loadTrack(nextIndex);
}

function prevTrack() {
    if (tracks.length <= 1) {
        // If one or zero tracks, previous means replay the current one
        if (tracks.length === 1) {
             audio.currentTime = 0;
             audio.play();
             console.log('Only one track, replaying.');
        }
        return;
    }
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    console.log('Previous track');
}

function renderPlaylist() {
    playlistUl.innerHTML = '';
    if (tracks.length === 0) {
         const li = document.createElement('li');
         li.textContent = "No tracks available.";
         playlistUl.appendChild(li);
         return;
    }
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="track-title">${track.title}</span> - <span class="track-artist">${track.artist}</span>`;
        li.dataset.index = index;
        li.addEventListener('click', () => {
            const clickedIndex = parseInt(li.dataset.index, 10);
            // If clicking the current track, toggle play/pause
            if (clickedIndex === currentTrackIndex) {
                playPause();
            } else {
                // If clicking a different track, load and play it
                loadTrack(clickedIndex);
                // Explicitly attempt to play after user interaction
                 audio.play().catch(error => {
                     console.log("Playback failed after selecting track:", error);
                     isPlaying = false; // Update state
                     updatePlayPauseButton();
                 });
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

    // Update internal state based on the actual audio.volume and muted properties
    // This is important because audio.volume might be slightly different due to floating point,
    // and audio.muted is the single source of truth for muting.
    currentVolume = audio.volume * 100;
    isMuted = audio.muted; // Sync isMuted state with the actual audio element muted state

    // If not muted and volume > 0, update lastVolume
    if (!isMuted && audio.volume > 0) {
         lastVolume = currentVolume;
    }

    updateVolumeIcon();
    updateVolumeSliderBackground();
    // console.log('Volume changed to', currentVolume, 'Muted:', isMuted);
}

function toggleMute() {
    // Toggle the actual audio element's muted state
    audio.muted = !audio.muted;

    // Update internal state based on the new audio.muted state
    isMuted = audio.muted;

    if (isMuted) {
        // If muting, save the current volume before setting slider to 0
        lastVolume = audio.volume * 100 > 0 ? audio.volume * 100 : 100; // Save non-zero volume if available
        volumeSlider.value = 0; // Move slider to 0 visually
         // audio.volume is not changed when muted, only the output is silenced.
         // We update volumeSlider.value to reflect the *perceived* volume.
    } else {
        // If unmuting, restore volume from lastVolume
        const restoredVolume = lastVolume > 0 ? lastVolume : 100;
        audio.volume = restoredVolume / 100; // Set audio volume
        volumeSlider.value = restoredVolume; // Move slider visually
        currentVolume = audio.volume * 100; // Update currentVolume based on actual audio volume
    }

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
     // For now, just ensure the icon is there and it's enabled if there are tracks.
     if (tracks.length > 0) {
        downloadBtn.innerHTML = downloadIcon;
        downloadBtn.disabled = false;
     } else {
        downloadBtn.innerHTML = downloadIcon; // Still show icon? Or maybe a greyed out version?
        downloadBtn.disabled = true;
     }
}

function downloadCurrentTrack() {
     if (tracks.length === 0 || currentTrackIndex === -1) {
         console.log("No track selected or available to download.");
         return;
     }
     const track = tracks[currentTrackIndex];
     const link = document.createElement('a');
     // The src might be relative or contain %20. The browser handles this for download.
     link.href = track.src;
     // Construct the filename using the track title and add .mp3 extension
     // Replace characters that might be problematic in filenames (optional but good practice)
     // A basic clean-up: remove characters not allowed in Windows filenames, replace spaces with underscores?
     // Or just keep spaces as they are often handled correctly by modern OS. Let's keep spaces for now.
     const cleanTitle = track.title.replace(/[<>:"/\\|?*]/g, '_').trim(); // Replace invalid file name chars with underscore
     link.download = `${cleanTitle}.mp3`;

     // Add to body and click to trigger download
     document.body.appendChild(link); // Append to body is necessary for some browsers (e.g., Firefox)
     link.click(); // Simulate click

     // Clean up the temporary link element
     document.body.removeChild(link);
     console.log(`Attempting to download: ${link.download} from ${link.href}`);
}


// --- Clock Functionality ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentClockElement.textContent = `${hours}:${minutes}:${seconds}`;
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
            // Move to the next track. If it was the last, it will loop back to the first.
            nextTrack();
            // nextTrack calls loadTrack, which attempts to play if isPlaying was true.
            // Since ended doesn't set isPlaying to false, it will attempt to play.
            break;
        case PlaybackModes.LOOP:
            audio.currentTime = 0; // Reset time to start
             audio.play().catch(error => {
                 console.log("Autoplay failed when looping:", error);
                 isPlaying = false;
                 updatePlayPauseButton();
             }); // Play the current track again
            console.log('Looping track');
            break;
        case PlaybackModes.RANDOM:
            // Play a random track. nextTrack(true) handles selection.
            nextTrack(true);
             // nextTrack calls loadTrack, which attempts to play if isPlaying was true (which it is).
            break;
        case PlaybackModes.STOP:
            isPlaying = false; // Explicitly stop
            updatePlayPauseButton(); // Update play/pause button to show play icon
            audio.currentTime = 0; // Reset time to start for potential replay
            updateProgressBar(); // Update progress bar to show 0
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
    // This event fires when audio.volume or audio.muted changes.
    // We should update the slider position, icon, and background here
    // to reflect the *actual* state of the audio element.
    const newVolume = audio.volume * 100;
    const newIsMuted = audio.muted;

    // Only update if there's a meaningful change to avoid infinite loops
    // (though handleVolumeChange and toggleMute are careful not to trigger this infinitely)
    if (currentVolume !== newVolume || isMuted !== newIsMuted) {
        currentVolume = newVolume;
        isMuted = newIsMuted;

        // Sync slider value *visually* with the actual audio volume (or 0 if muted)
        volumeSlider.value = isMuted ? 0 : currentVolume;

        // Sync lastVolume when volume changes but not muted
         if (!isMuted && audio.volume > 0) {
             lastVolume = currentVolume;
         }

        updateVolumeIcon();
        updateVolumeSliderBackground();
         // console.log('Volumechange event - Volume:', currentVolume, 'Muted:', isMuted);
    }
});

audio.addEventListener('loadedmetadata', () => {
     // This listener is now managed within loadTrack using { once: true }
     // to prevent duplicate listeners if loadTrack is called multiple times.
     // The code here is kept for clarity but the main logic is in loadTrack.
    totalTimeElement.textContent = formatTime(audio.duration);
    currentTimeElement.textContent = formatTime(0);
    progressFill.style.width = '0%';
});


// Event Listeners
prevBtn.addEventListener('click', prevTrack);
playPauseBtn.addEventListener('click', playPause);
// Next button plays next in sequence UNLESS in Random mode
nextBtn.addEventListener('click', () => nextTrack(currentMode === PlaybackModes.RANDOM));
volumeBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', handleVolumeChange); // 'input' is better for real-time updates than 'change'
modeBtn.addEventListener('click', cyclePlaybackMode); // Add event listener for mode button
downloadBtn.addEventListener('click', downloadCurrentTrack); // Add event listener for download button

// --- Initial Setup ---
renderPlaylist();
if (tracks.length > 0) {
    loadTrack(currentTrackIndex); // Load the initial track if tracks exist
} else {
    trackTitleElement.textContent = 'No Tracks Loaded';
    trackArtistElement.textContent = '';
    totalTimeElement.textContent = '0:00';
    currentTimeElement.textContent = '0:00';
    progressFill.style.width = '0%';
     // Disable controls if no tracks
    prevBtn.disabled = true;
    playPauseBtn.disabled = true;
    nextBtn.disabled = true;
    downloadBtn.disabled = true;
}


// Initialize volume slider, icon, and background
volumeSlider.value = currentVolume; // Set slider position based on initial currentVolume (100)
audio.volume = currentVolume / 100; // Set actual audio volume (1.0)
audio.muted = false; // Ensure not muted initially unless required
isMuted = audio.muted; // Sync isMuted state
updateVolumeIcon(); // Update icon based on initial state (High Volume)
updateVolumeSliderBackground(); // Update background based on initial state (100%)

// Initialize mode button display
updateModeButton();
// Initialize download button display
updateDownloadButton();

// Initialize and start the clock
updateClock();
setInterval(updateClock, 1000); // Update clock every second

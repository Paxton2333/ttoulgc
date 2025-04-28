const tracks = [
    { title: 'Misma Void', artist: 'P4XT0N Series', src: 'mismavoid.mp3' },
    { title: 'Infinitus Galaxy', artist: 'P4XT0N Series', src: 'infinitusgalaxy.mp3' },
    { title: 'Battle of the Elements', artist: 'P4XT0N Series', src: 'bote.mp3' },
];

let currentTrackIndex = 0;
let isPlaying = false;

let currentVolume = 75;
let lastVolume = 75;
let isMuted = false;

const audio = new Audio(); 

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
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-3.01-7.86-7-8.77v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c1.38-.31 2.63-.95 3.72-1.88L19.73 21 21 19.73l-9-9L4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42-.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.72-1.88L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
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

    audio.src = track.src;
    audio.load(); 

    currentTimeElement.textContent = '0:00';
    totalTimeElement.textContent = '0:00';
    progressFill.style.width = '0%';


    updatePlaylistHighlight();
    updatePlayPauseButton(); 

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

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    console.log('Next track');
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
        lastVolume = audio.volume * 100 > 0 ? audio.volume * 100 : 75;
        audio.muted = true; 
        volumeSlider.value = 0;
    } else {
        const restoredVolume = lastVolume > 0 ? lastVolume : 50;
        audio.muted = false;
        audio.volume = restoredVolume / 100; 
        volumeSlider.value = restoredVolume;
    }
    currentVolume = audio.volume * 100; 

    updateVolumeIcon();
    updateVolumeSliderBackground();
    console.log(isMuted ? 'Muted' : `Unmuted, volume: ${currentVolume}`);
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
    console.log('Track ended');
    nextTrack(); 
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
nextBtn.addEventListener('click', nextTrack);
volumeBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', handleVolumeChange); 

renderPlaylist();
loadTrack(currentTrackIndex); 

volumeSlider.value = currentVolume;
audio.volume = currentVolume / 100; 
updateVolumeIcon();
updateVolumeSliderBackground();

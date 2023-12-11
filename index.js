// DOM elements
const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    playBtn = document.getElementById('play'),
    nextBtn = document.getElementById('next'),
    background = document.getElementById('bg-img');

// Load the YouTube API asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// Audio and playlist
const music = new Audio();
// const songs = [
//     {
//         path: 'assets/1.mp3',
//         displayName: 'Cosmic Star Candy',
//         cover: 'assets/starry.jpg',
//         artist: 'Daystar',
//         type: 'audio'
//     },
// ];


const media = [
    {
        path: '',
        displayName: 'Cosmic Star Candy',
        cover: '',
        id: "eq3C1Uwz6YU",
        artist: 'Daystar',
        type: 'video'
    }
];

let musicIndex = 0;
let isPlaying = false;

// Toggle play/pause
function togglePlay() {
    isPlaying ? pauseMusic() : playMusic();
}

// Play music
function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
}

// Pause music
function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
}

// Load music details (for both audio and YouTube video)
function loadMedia(media) {
    if (media.type === 'audio') {
        music.src = media.path;
        title.textContent = media.displayName;
        artist.textContent = media.artist;
        image.src = media.cover;
        background.src = media.cover;
    } else if (media.type === 'video') {
        title.textContent = media.displayName;
        artist.textContent = media.artist;
    }
}

// Change media based on direction (-1 for previous, 1 for next)
async function changeMedia(direction) {
    // const currentMedia = getCurrentMedia();
    musicIndex = (musicIndex + direction + media.length) % media.length;
    console.log(musicIndex)
    console.log(media[musicIndex])
    loadMedia(media[musicIndex]);
    player.loadVideoById(media[musicIndex].id, 0, "large");
    playMusic();
}

// Function to get the currently playing media (audio or video)
// function getCurrentMedia() {
//     return isPlaying ? media[musicIndex] : { type: 'video', videoTitle: 'YouTube Video', videoArtist: 'YouTube' };
// }

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '300',
        width: '300',
        videoId: 'eq3C1Uwz6YU',
        playerVars: {
            playsinline: 1,
            origin: 'https://www.youtube.com'
        },
        origin: 'http://127.0.0.1:5501/',
        // Add your API key here

        // AIzaSyDcrsvYDdftdtCEk17gOW7_AG-0VKlyXc
        apiKey: 'AIzaSyDcrsvYDdftdtCEk17gOW7_AG-0VKlyXcE',
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

// YouTube video ID
// const videoID = "sVTy_wmn5SU";

async function search(){
    const searchTerm = document.getElementById("searchBox").value;
    const api_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchTerm}&type=video&key=AIzaSyDcrsvYDdftdtCEk17gOW7_AG-0VKlyXcE`
    
    // Send request to grab data for first video in search
    const res = await fetch(api_url)
    const data = await res.json()

    console.log(api_url)

    // Grab videoId from response
    const videoId = data.items[0].id.videoId

    console.log(videoId)

    const newMedia = {
        path: '',
        displayName: data.items[0].snippet.title,
        cover: '',
        id: videoId,
        artist: data.items[0].snippet.channelTitle,
        type: 'video'
    }

    media.push(newMedia)
    console.log(media)

    // Skip to the latest added song
    changeMedia(media.length-1);
    // Load video into player
    // player.loadVideoById(videoId, 0, "large")
    // playMusic();
}


// Update progress bar and display
function updateProgressBar() {
    const { duration, currentTime } = music; // Assuming music is your audio player
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}


// Set progress bar based on user click
function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

// Event handlers for YouTube player
function onPlayerReady(e) {
    // Optional: Logic when the YouTube player is ready
}

function onPlayerStateChange(e) {
    // Optional: Logic when the YouTube player's state changes
}

//scrolling effect for music title
function startScrolling() {
    const containerWidth = musicTitleContainer.offsetWidth;
    const titleWidth = musicTitle.offsetWidth;

    if (titleWidth > containerWidth) {
        musicTitle.style.animation = `scroll ${titleWidth / 50}x linear infinite`;
    }
}   

// Event listener for play/pause button for YouTube player
playBtn.addEventListener('click', () => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

// Event listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMedia(-1));
nextBtn.addEventListener('click', () => changeMedia(1));
music.addEventListener('timeupdate', updateProgressBar);
// playerProgress.addEventListener('click', setProgressBar);

loadMedia(media[musicIndex])

startScrolling();
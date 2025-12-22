let currentSong = new Audio()
let songs

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs() {

    // 1. Fetch your JSON file
    let data;
    try {
        data = await fetch("./Song list/songs.json")
            .then(res => res.json());
    } catch (err) {
        console.error("Failed to fetch songs.json:", err);
        return [];
    }

    // 2. Extract the file paths
    songs = data.songs.map(song => song.file);

    return songs
}

const playMusic = (track) => {
    const url = encodeURI(track);
    // Stop previous playback and reset
    try {
        currentSong.pause();
        currentSong.currentTime = 0;
    } catch (err) {
        // if currentSong isn't ready yet, ignore
    }
    // Update source and play
    currentSong.src = url;
    currentSong.play().catch(err => console.error("Playback failed for", track, err));

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    return currentSong;
}


async function main() {

    // Gets the list of all the songs
    let songs = await getSongs();
    // console.log(songs);

    currentSong.src = songs[0]

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        // Extract the last path segment as the display name (remove any empty segments)
        const parts = song.split('/').filter(Boolean);
        const name = parts[parts.length - 1] || song;
        // Append the name to the list (use insertAdjacentHTML for performance)
        // include the full file path on the <li> so clicks can access it directly
        songUL.insertAdjacentHTML('beforeend', `<li data-file="${song}">
                            <img class="invert" src="assets/music.svg" alt="">
                            <div class="info">
                                <div>${name}</div>
                                <div>Anonymous</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="assets/play.svg" alt="">
                            </div>
                        </li>`);
    }


    // Prepare the audio element (do not autoplay)
    // var audio = new Audio();
    // audio.src = songs[1];
    // // audio.play()   // The audio works fine

    // // Attach play to a user gesture (autoplay without a gesture is blocked by many browsers)
    // const playButton = document.querySelector(".playmusic") || document.body;
    // playButton.addEventListener("click", async function onPlayClick() {
    //     try {
    //         await audio.play();
    //     } catch (err) {
    //         console.error("Playback failed:", err);
    //     }
    // });



    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            const file = e.dataset.file;
            console.log("Playing:", file);
            if (!file) {
                console.error("No file path found on element", e);
                return;
            }
            playMusic(file);

        })
    })


    // Attach play/pause toggle to the bottom play button
    const playBtn = document.getElementById('play');
    if (playBtn) {
        // Toggle playback when user clicks the control
        playBtn.addEventListener('click', () => {
            if (!currentSong.src) return; // nothing loaded yet
            if (currentSong.paused) {
                currentSong.play().catch(err => console.error('Playback failed on button click', err));
            } else {
                currentSong.pause();
            }
        });

        // Keep the button icon in sync with actual playback state
        currentSong.addEventListener('play', () => playBtn.src = 'assets/pause.svg');
        currentSong.addEventListener('pause', () => playBtn.src = 'assets/play.svg');
        currentSong.addEventListener('ended', () => playBtn.src = 'assets/play.svg');
    }

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Add an event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"

        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    // Add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
        console.log('ok');

    })

    // Add an event listener for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
        console.log('okay');

    })

    // Add an event listener to previous

    previous.addEventListener("click", () => {
        console.log('Previous clicked');
        console.log(currentSong);

        let currentFile = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]);
        let index = songs.findIndex(song => song.endsWith(currentFile));

        if((index-1) >= 0){

            console.log(songs, index, length);
            playMusic(songs[index-1])
        }


    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        console.log('next clicked');

        let currentFile = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]);
        let index = songs.findIndex(song => song.endsWith(currentFile));

        if((index+1) < songs.length){

            console.log(songs, index, length);
            playMusic(songs[index+1])
        }

    })

    //Add an event to volume
    let muteVol = document.querySelector(".volume img")
    document.getElementById("volrange").addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value);
        let num = parseInt(e.target.value)
        currentSong.volume = num / 100
        if(num === 0){
            muteVol.src = "assets/mute.svg"
        }
        else{
            muteVol.src = "assets/volume.svg"
        }
    })

}

main()


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
    let songs = data.songs.map(song => song.file);

    return songs
}


async function main() {
    let currentSong
    
    // Gets the list of all the songs
    let songs = await getSongs();
    // console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        // Extract the last path segment as the display name (remove any empty segments)
        const parts = song.split('/').filter(Boolean);
        const name = parts[parts.length - 1] || song;
        // Append the name to the list (use insertAdjacentHTML for performance)
        songUL.insertAdjacentHTML('beforeend', `<li>
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
    var audio = new Audio();
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
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        
    })
}

main()
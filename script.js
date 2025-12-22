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

    // 2. Keep the full song objects for richer UI (name, folder, file)
    songs = data.songs || [];

    return songs;
}

const playMusic = (track) => {
    // track can be a file path string or a song object
    let file = '';
    let songObj = null;

    if (typeof track === 'string') {
        file = track;
        // try to find matching song object
        songObj = songs && songs.find(s => s.file === file || s.file === decodeURIComponent(file) || s.file.endsWith(decodeURIComponent(file).split('/').pop()));
    } else if (typeof track === 'object' && track !== null) {
        songObj = track;
        file = track.file;
    }

    const url = encodeURI(file);
    // Stop previous playback and reset
    try {
        currentSong.pause();
        currentSong.currentTime = 0;
    } catch (err) {
        // if currentSong isn't ready yet, ignore
    }

    // Update source and play
    currentSong.src = url;
    currentSong.play().catch(err => console.error("Playback failed for", file, err));

    // Update displayed song info: prefer name/folder from song object
    const songInfoEl = document.querySelector(".songinfo");
    if (songInfoEl) {
        songInfoEl.innerHTML = '';
        if (songObj) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'song-title';
            titleDiv.textContent = songObj.name || '';
            songInfoEl.appendChild(titleDiv);

            // Only show artist/folder if it's provided and different from the title
            if (songObj.folder && songObj.folder !== songObj.name) {
                const artistDiv = document.createElement('div');
                artistDiv.className = 'song-artist';
                artistDiv.textContent = songObj.folder;
                songInfoEl.appendChild(artistDiv);
            }
        } else {
            songInfoEl.textContent = decodeURIComponent(file || '');
        }
    }

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    return currentSong;
}


async function main() {

    // Gets the list of all the songs (array of objects)
    songs = await getSongs();
    if (!songs || songs.length === 0) {
        console.warn('No songs found');
        return;
    }

    // Load first song but do not autoplay
    currentSong.src = songs[0].file;

    // Build left-side song list
    const songUL = document.querySelector('.songList ul');
    songUL.innerHTML = '';

    for (const song of songs) {
        const name = song.name || song.file.split('/').slice(-1)[0];
        songUL.insertAdjacentHTML('beforeend', `<li data-file="${song.file}">
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

    // Generate cards dynamically in the main area
    const cardContainer = document.querySelector('.card-container');
    if (cardContainer) {
        cardContainer.innerHTML = '';

        // Small inline play svg (same as existing markup)
        const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none"><path fill="currentColor" d="M13.852,6.287 L13.941,6.337 C15.573,7.265 16.857,7.994 17.771,8.662 C18.691,9.334 19.372,10.037 19.616,10.963 C19.795,11.643 19.795,12.357 19.616,13.037 C19.372,13.963 18.691,14.666 17.771,15.339 C16.857,16.006 15.573,16.735 13.941,17.663 L13.852,17.713 C12.275,18.61 11.033,19.315 10.023,19.744 C9.005,20.177 8.077,20.397 7.175,20.141 C6.513,19.953 5.909,19.597 5.424,19.107 C4.764,18.441 4.5,17.522 4.374,16.415 C4.25,15.317 4.25,13.879 4.25,12.05 L4.25,11.95 C4.25,10.121 4.25,8.683 4.374,7.585 C4.5,6.478 4.764,5.559 5.424,4.893 C5.909,4.403 6.513,4.047 7.175,3.859 C8.077,3.603 9.005,3.823 10.023,4.256 C11.033,4.685 12.275,5.391 13.852,6.287 Z M9.436,5.636 C8.514,5.244 7.984,5.189 7.584,5.302 C7.171,5.419 6.794,5.642 6.489,5.949 C6.192,6.249 5.979,6.747 5.865,7.753 C5.751,8.757 5.75,10.11 5.75,12 C5.75,13.89 5.751,15.243 5.865,16.247 C5.979,17.253 6.192,17.751 6.489,18.051 C6.794,18.358 7.171,18.581 7.584,18.698 C7.984,18.811 8.514,18.756 9.436,18.364 C10.357,17.972 11.524,17.311 13.155,16.384 C14.842,15.426 16.05,14.738 16.886,14.127 C17.724,13.515 18.056,13.072 18.165,12.655 C18.278,12.226 18.278,11.774 18.165,11.345 C18.056,10.929 17.724,10.485 16.886,9.873 C16.05,9.262 14.842,8.574 13.155,7.616 C11.524,6.689 10.357,6.028 9.436,5.636 Z" /></svg>`;

        for (const song of songs) {
            const folderPath = song.file.replace(/\/[^\/]+$/, '');
            const cover1 = `${folderPath}/cover.jpg`;
            const cover2 = `${folderPath}/cover (1).jpg`;
            const title = song.name || song.folder || '';
            const subtitle = song.folder || '';

            const cardHTML = `<div class="card" data-file="${song.file}">
                                <div class="play">${playSvg}</div>
                                <img src="${encodeURI(cover1)}" alt="${title}">
                                <h2>${title}</h2>
                                <p>${subtitle}</p>
                              </div>`;
            cardContainer.insertAdjacentHTML('beforeend', cardHTML);
        }

        // attach click handlers to cards + robust image fallback
        Array.from(cardContainer.querySelectorAll('.card')).forEach(card => {
            const img = card.querySelector('img');
            const folderPath = card.dataset.file.replace(/\/[^\/]+$/, '');
            const alt1 = `${folderPath}/cover.jpg`;
            const alt2 = `${folderPath}/cover (1).jpg`;

            // first fallback: try cover (1).jpg, then global default
            if (img) {
                img.addEventListener('error', function onError() {
                    // If we haven't tried alt1 yet, try alt1
                    if (this.src && decodeURIComponent(this.src).endsWith('cover.jpg') && !this.dataset._triedAlt) {
                        this.dataset._triedAlt = '1';
                        this.src = encodeURI(alt2);
                        return;
                    }
                    // otherwise use global default cover in assets
                    this.removeEventListener('error', onError);
                    this.src = 'assets/cover.jpg';
                });
            }

            card.addEventListener('click', () => {
                const file = card.dataset.file;
                if (file) playMusic(file);
            });
        });
    }

    // Re-bind the left list click handlers (safer than relying on earlier Node collection)
    Array.from(document.querySelectorAll('.songList li')).forEach(e => {
        e.addEventListener('click', () => {
            const file = e.dataset.file;
            if (file) playMusic(file);
        });
    });

    // Attach play/pause toggle to the bottom play button
    const playBtn = document.getElementById('play');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!currentSong.src) return;
            if (currentSong.paused) {
                currentSong.play().catch(err => console.error('Playback failed on button click', err));
            } else {
                currentSong.pause();
            }
        });

        currentSong.addEventListener('play', () => playBtn.src = 'assets/pause.svg');
        currentSong.addEventListener('pause', () => playBtn.src = 'assets/play.svg');
        currentSong.addEventListener('ended', () => playBtn.src = 'assets/play.svg');
    }

    // Listen for timeupdate event with guards
    currentSong.addEventListener('timeupdate', () => {
        const current = currentSong.currentTime || 0;
        const duration = currentSong.duration || 0;
        document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(current)}/${secondsToMinutesSeconds(duration)}`;

        const pct = (duration > 0) ? (current / duration) * 100 : 0;
        document.querySelector('.circle').style.left = pct + '%';
    });

    // Robust seekbar handler (use clientX to handle clicks on children)
    const seekbar = document.querySelector('.seekbar');
    if (seekbar) {
        seekbar.addEventListener('click', e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(1, x / rect.width));
            document.querySelector('.circle').style.left = (percent * 100) + '%';
            if (currentSong.duration) currentSong.currentTime = currentSong.duration * percent;
        });
    }

    // Hamburger / close
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';document.querySelector(".close").classList.add("active")
    });
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-120%';
    });

    // Previous / Next buttons
    const prevBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');

    if (prevBtn) prevBtn.addEventListener('click', () => {
        const currentFile = decodeURIComponent(currentSong.src.split('/').slice(-1)[0]);
        const index = songs.findIndex(s => s.file.endsWith(currentFile));
        if (index > 0) {
            console.log(songs, index, songs.length);
            playMusic(songs[index - 1].file);
        }
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        const currentFile = decodeURIComponent(currentSong.src.split('/').slice(-1)[0]);
        const index = songs.findIndex(s => s.file.endsWith(currentFile));
        if (index >= 0 && index < songs.length - 1) {
            console.log(songs, index, songs.length);
            playMusic(songs[index + 1].file);
        }
    });

    // Volume control
    const muteVol = document.querySelector('.volume img');
    const volRange = document.getElementById('volrange');
    if (volRange) volRange.addEventListener('change', (e) => {
        const num = parseInt(e.target.value, 10) || 0;
        currentSong.volume = num / 100;
        if (muteVol) muteVol.src = num === 0 ? 'assets/mute.svg' : 'assets/volume.svg';
    });

}

main();


async function getSongs() {

    // 1. Fetch your JSON file
    let data = await fetch("./Song list/songs.json")
                      .then(res => res.json());

    // 2. Extract the file paths
    let songs = data.songs.map(song => song.file);

    return songs
}


async function main() {
    
    // Gets the list of all the songs
    let songs = await getSongs();
    console.log(songs);


    //Play the first song
    var audio = new Audio(songs[1])
    audio.play()
}

main()


// Path:
// D:\Websites\clones\spotify clone
// spotify clone/
//   index.html
//   Song list/
//     songs.json
//   songs/
//     Agar tum saath ho/
//       agar tum sath ho.mp3
//     Bulleya/
//       bulleya.mp3

// JSON:
// {
//     "songs": [
//         {
//             "name": "Agar tum saath ho",
//             "folder": "Agar tum saath ho",
//             "file": "songs/Agar tum saath ho/agar tum sath ho.mp3"
//         },
//         {
//             "name": "Bulleya",
//             "folder": "Bulleya",
//             "file": "songs/Bulleya/bulleya.mp3"
//         },
//         {
//             "name": "Die with a smile",
//             "folder": "Die with a smile",
//             "file": "songs/Die with a smile/Die with a smile.mp3"
//         },
//         {
//             "name": "mast magan",
//             "folder": "mast magan",
//             "file": "songs/mast magan/mast magan.mp3"
//         },
//         {
//             "name": "Night changes",
//             "folder": "Night changes",
//             "file": "songs/Night changes/Night changes.mp3"
//         },
//         {
//             "name": "pal pal",
//             "folder": "pal pal",
//             "file": "songs/pal pal/pal pal.mp3"
//         },
//         {
//             "name": "Taj dar e haram",
//             "folder": "Taj dar e haram",
//             "file": "songs/Taj dar e haram/Taj dar e haram.mp3"
//         },
//         {
//             "name": "Tu jane na",
//             "folder": "Tu jane na",
//             "file": "songs/Tu jane na/Tu jane na.mp3"
//         },
//         {
//             "name": "wanna be yours",
//             "folder": "wanna be yours",
//             "file": "songs/wanna be yours/wanna be yours.mp3"
//         },
//         {
//             "name": "ye tune kia kia",
//             "folder": "ye tune kia kia",
//             "file": "songs/ye tune kia kia/ye tune kia kia.mp3"
//         }
//     ]
// }

// JS:


// async function getSongs() {

//     // 1. Fetch your JSON file
//     let data = await fetch("./Song list/songs.json")
//                       .then(res => res.json());

//     // 2. Extract the file paths
//     let songs = data.songs.map(song => song.file);

//     return songs
// }


// async function main() {
    
//     // Gets the list of all the songs
//     let songs = await getSongs();
//     console.log(songs);


//     //Play the first song
//     var audio = new Audio(songs[1])
//     audio.play()
// }

// main()

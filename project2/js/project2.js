"use strict";
window.onload = init;

function init() {
    document.querySelector("#search").onclick = getData;
}

let term = "";
let order = "";
let radio = "";
let sort = "";
let searchBy = "";

function getData() {
    const content = document.getElementById('content');

    content.innerHTML = "";

    searchBy = document.querySelector("#searchBy").value;
    const API_URL = 'https://api.jikan.moe/v4';
    let url = API_URL;
    term = document.querySelector("#searchterm").value;
    term = term.trim();
    term = encodeURIComponent(term);

    if (term.length < 1) {
        document.querySelector("#debug").innerHTML = "<b>Enter a search term first!</b>";
        return;
    }

    if (searchBy == "anime") {
        url += `/anime?q=${term}?sfw=true`

        order = document.querySelector("#order").value

        if (order.length > 1) {
            url += `&order_by=${order}`
        }

        radio = document.querySelector("#sort");

        sort = radio.elements["sort"].value;

        url += `&sort=${sort}`
    }
    else if (searchBy == "character") {
        url += `/characters?q=${term}`
    }

    document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;

    GetAnime(searchBy);

    function GetAnime(searchBy) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.data.forEach(item => {
                    const anime = item;
                    const imageUrl = item.images;
                    const animeData = document.createElement('div');
                    if (searchBy == "anime") {
                        animeData.innerHTML = `
            <p></p>
              <img src ="${imageUrl.jpg.image_url}">
              <p><b>Title:</b> ${anime.title}</p>
              <p><b>Japanese Name:</b> ${anime.title_japanese} <p>
              <p><b>Synopsis:</b> ${anime.synopsis}</p>
              <p><b>Score:</b> ${anime.score}</p>
              <p><b>Rank:</b> ${anime.rank}</p>
              <p><b>Type:</b> ${anime.type}</p>
              <p><b>Total Episodes:</b> ${anime.episodes}</p>
              <p><b>Aired:</b> ${anime.aired.string}</p>
            `;
                    }
                    else if (searchBy == "character") {
                        animeData.innerHTML = `
            <p></p>
              <img src ="${imageUrl.jpg.image_url}">
              <p><b>Name:</b> ${anime.name}</p>
              <p><b>About:</b> ${anime.about}</p>
            `;
                    }

                    content.appendChild(animeData);
                })
            });
    }
}

"use strict";
window.onload = init;

function init() {
    document.querySelector("#search").onclick = getData;
    document.querySelector("#prevPage").onclick = ChangePagePrev;
    document.querySelector("#nextPage").onclick = ChangePageNext;
}

let term = "";
let prevTerm = null;
let order = "";
let radio = "";
let sort = "";
let searchBy = "";
let isNextPage = false;
let currentPage = 1;
let pageCount = 0;

function getData() {
    const content = document.getElementById('content');
    const pageDiv = document.getElementById('page');

    content.innerHTML = "";
    pageDiv.innerHTML = "";

    const API_URL = 'https://api.jikan.moe/v4';
    let url = API_URL;
    term = document.querySelector("#searchterm").value;
    term = term.trim();
    term = encodeURIComponent(term);

    if (term.length < 1) {
        document.querySelector("#debug").innerHTML = "<b>Enter a search term first!</b>";
        return;
    }

    if (term != prevTerm && prevTerm != null){
        currentPage = 1;
    }

    url += `/anime?q=${term}?sfw=true`

    order = document.querySelector("#order").value

    if (order.length > 1) {
        url += `&order_by=${order}`
    }

    radio = document.querySelector("#sort");

    sort = radio.elements["sort"].value;

    url += `&sort=${sort}&limit=20&page=${currentPage}`;

    document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;

    GetAnime();
    GetPages();

    prevTerm = term;

    function GetAnime() {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.data.forEach(item => {
                    const anime = item;
                    const imageUrl = item.images;
                    const animeData = document.createElement('div');

                    if (anime.title_english != null) {
                        animeData.innerHTML = `
            <p></p>
              <img src ="${imageUrl.jpg.image_url}">
              <p><b>Title:</b> ${anime.title_english}</p>
              <p><b>Japanese Title:</b> ${anime.title} <p>
              <p><b>Synopsis:</b> ${anime.synopsis}</p>
              <p><b>Score:</b> ${anime.score}</p>
              <p><b>Rank:</b> ${anime.rank}</p>
              <p><b>Type:</b> ${anime.type}</p>
              <p><b>Total Episodes:</b> ${anime.episodes}</p>
              <p><b>Aired:</b> ${anime.aired.string}</p>
            `;
                    }
                    else {
                        animeData.innerHTML = `
                        <p></p>
                          <img src ="${imageUrl.jpg.image_url}">
                          <p><b>Japanese Title:</b> ${anime.title} <p>
                          <p><b>Synopsis:</b> ${anime.synopsis}</p>
                          <p><b>Score:</b> ${anime.score}</p>
                          <p><b>Rank:</b> ${anime.rank}</p>
                          <p><b>Type:</b> ${anime.type}</p>
                          <p><b>Total Episodes:</b> ${anime.episodes}</p>
                          <p><b>Aired:</b> ${anime.aired.string}</p>
                        `;
                    }

                    content.appendChild(animeData);
                })
            });
    }

    function GetPages() {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const page = data.pagination.current_page
                currentPage = page
                pageCount = data.pagination.last_visible_page
                isNextPage = data.pagination.has_next_page
                const pageData = document.createElement('div');
                pageData.innerHTML = `
                <p>Page: ${page}/${pageCount}</p>`

                pageDiv.appendChild(pageData);
            });
    }
}

function ChangePagePrev() {
    if (currentPage > 1) {
        currentPage--;
        getData();
    }
}

function ChangePageNext() {
    if (isNextPage == true && currentPage != pageCount) {
        currentPage++;
        getData();
    }
}
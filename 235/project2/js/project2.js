"use strict";
window.onload = init;

//sets all the inital events to load on clicks and loads in the stored search term
function init() {
    document.querySelector("#search").onclick = getData;
    document.querySelector("#prevPage").onclick = ChangePagePrev;
    document.querySelector("#nextPage").onclick = ChangePageNext;

    let searchTerm;
    const prefixIn = "bzd4328-";
    const termKeyIn = prefixIn + "term";
    const storedTermIn = localStorage.getItem(termKeyIn);

    if (storedTermIn) {
        searchTerm = storedTermIn;
    } else {
        searchTerm = "";
    }
    document.querySelector("#searchterm").value = searchTerm;
}

//variables for later
let term = "";
let prevTerm = null;
let order = "";
let radio = "";
let sort = "";
let searchBy = "";
let isNextPage = false;
let currentPage = 1;
let pageCount = 0;
let prevOrder = null;
const prefix = "bzd4328-";
const termKey = prefix + "term";


//gets the search term and all the other sorting terms from the document and then loads the query from the values
function getData() {
    const content = document.querySelector("#content");
    const pageDiv = document.querySelector("#page");

    content.innerHTML = "";
    pageDiv.innerHTML = "";

    const API_URL = 'https://api.jikan.moe/v4';
    let url = API_URL;
    term = document.querySelector("#searchterm").value;
    localStorage.setItem(termKey, term);
    term = term.trim();
    term = encodeURIComponent(term);

    if (term.length < 1) {
        document.querySelector("#debug").innerHTML = "<b>Enter a search term first!</b>";
        return;
    }

    

    url += `/anime?q=${term}?`

    order = document.querySelector("#order").value

    if (order.length > 1) {
        url += `&order_by=${order}`
    }

if ((term != prevTerm && prevTerm != null) || (order != prevOrder && prevOrder != null)) {
        currentPage = 1;
    }

    radio = document.querySelector("#sort");

    sort = radio.elements["sort"].value;

    url += `&sort=${sort}&limit=20&page=${currentPage}&sfw=true`;

    document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;

    GetAnime();
    GetPages();

    prevTerm = term;
    prevOrder = order;

    //Loads all the anime search data from the API on to the website
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
              <p><b>Status:</b> ${anime.status}</p>
              <p><b>Aired:</b> ${anime.aired.string}</p>
              <p><b>Rating:</b> ${anime.rating}</p>
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
                          <p><b>Status:</b> ${anime.status}</p>
                          <p><b>Aired:</b> ${anime.aired.string}</p>
                          <p><b>Rating:</b> ${anime.rating}</p>
                        `;
                    }

                    content.appendChild(animeData);
                })
            });
    }

    //Gets the total amount of pages for the searched term
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

//Goes to the previous page
function ChangePagePrev() {
    if (currentPage > 1) {
        currentPage--;
        getData();
    }
}

//Goes to the next page
function ChangePageNext() {
    if (isNextPage == true && currentPage != pageCount) {
        currentPage++;
        getData();
    }
}
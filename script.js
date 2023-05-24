const API_KEY = '92cafd2032msh75252a91a66893ap1128bdjsn75fcdc8c70ba';
const API_HOST = 'coinranking1.p.rapidapi.com';
const REFERENCE_CURRENCY_UUID = 'yhjMzLPhuIDl';

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
    }
};

let coins;
// Pobranie danych z API
fetch(`https://${API_HOST}/coins?referenceCurrencyUuid=${REFERENCE_CURRENCY_UUID}&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=25&offset=0`, options)
    .then(response => response.json())
    .then(response => getDataFromApi(response.data))
    .catch(err => console.error(err));

function getDataFromApi(data) {
    // Przetwarzanie danych i tworzenie interfejsu użytkownika
    createNavigationBar(data.stats);
    coins = data.coins;
    createCoinsTable(coins);
}

let favouritesList = new Array(); // Inicjalizacja pustej tablicy ulubionych monet

// Sprawdzenie, czy w localStorage istnieje klucz "favourites"
if (localStorage.favourites == undefined) {
    // Jeśli klucz nie istnieje, zapisuje pustą tablicę jako wartość "favourites" w localStorage
    localStorage.favourites = JSON.stringify(favouritesList);
} else {
    // Jeśli klucz istnieje, odczytuje wartość "favourites" z localStorage i parsuje ją jako tablicę
    favouritesList = JSON.parse(localStorage.favourites);

    // Iteruje przez elementy tablicy favouritesList
    favouritesList.forEach(coin => {
        // Tutaj można wykonać działania na poszczególnych monetach, które znajdują się na liście ulubionych

        // Przykładowy kod, który pobiera element ikony monety o ID "icon" + coin
        let iconElement = document.getElementById("icon" + coin);
    });
}

function createNavigationBar(data) {
    // Ustawianie wartości elementów na podstawie danych
    document.getElementById("total").innerHTML = ("Total: " + data.total);
    document.getElementById("totalCoins").innerHTML = ("Total Coins: " + data.totalCoins);
    document.getElementById("totalMarkets").innerHTML = ("Total Markets: " + parseFloat(data.totalMarkets));
    document.getElementById("totalExchanges").innerHTML = ("Total Exchanges: " + parseFloat(data.totalExchanges));
    document.getElementById("totalMarketCap").innerHTML = ("Total Market Cap: " + parseFloat(data.totalMarketCap));
    document.getElementById("total24hVolume").innerHTML = ("Total 24h Volume: " + parseFloat(data.total24hVolume));

    // Ustawianie liczby ulubionych monet
    document.getElementById("favourites").innerHTML = ("My favourites coins: " + favouritesList.length);

    // Ustawianie funkcji obsługującej kliknięcie na element "favourites"
    document.getElementById("favourites").onclick = showFavourites;
}


let showOnlyFavourites = false; // Zmienna śledząca stan wyświetlania tylko ulubionych

function createCoinsTable(data) {
    const favouritesList = JSON.parse(localStorage.getItem("favourites")) || [];
    const coinsTableBodyElement = document.getElementById("coinsTableBody");
    coinsTableBodyElement.innerHTML = "";

    // Sortowanie danych
    const sortedData = sortData(data);

    // Sprawdź, czy wyświetlasz tylko ulubione monety
    const filteredData = showOnlyFavourites ? sortedData.filter(element => favouritesList.includes(element.uuid)) : sortedData;

    filteredData.forEach(element => {
        let isCoinInFavourite = favouritesList.includes(element.uuid);
        let priceFormatted = parseFloat(element.price).toLocaleString("en-US", { style: "currency", currency: "USD" });
        let marketCapFormatted = parseInt(element.marketCap).toLocaleString("en-US", { style: "currency", currency: "USD" });
        let changeColor = element.change > 0 ? "green" : "red";

        coinsTableBodyElement.innerHTML += `
        <tr id="${element.uuid}">
            <td>${element.rank}</td>
            <td onClick="displayCoinModal(this.parentNode.id)"><img src="${element.iconUrl}" alt="${element.name} icon" > ${element.name}</td>
            <td onClick="displayCoinModal(this.parentNode.id)">${element.symbol}</td>
            <td>${priceFormatted}</td>
            <td><font color=${changeColor}>${element.change}</td>
            <td>${marketCapFormatted}</td>
            <td>
                <div class="chartContainer">
                    <canvas id="myChart-${element.uuid}" class="myChart"></canvas>
                </div>
            </td>
            <td><i id="icon${element.uuid}" class="fa-solid fa-star ${isCoinInFavourite ? 'text-warning' : ''}" onClick="addCoinToFavourites(this.id)"></i></td>

        </tr>
        `;
        getCoinPriceHistory(element, `myChart-${element.uuid}`);
    });
}

function getCoinPriceHistory(coinInfo, chartId) {
    let coinId = coinInfo.uuid;
    fetch('https://coinranking1.p.rapidapi.com/coin/' + coinId + '/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h', options)
        .then(response => response.json())
        .then(response => displayCoinModalInfo(coinInfo, response, chartId))
        .catch(err => console.error(err));
}

function displayCoinModalInfo(coinData, priceHistory, chartId) {
    let price = [];
    let dates = [];
    var interval = Math.floor(priceHistory.data.history.length / 30);
    for (var i = 0; i < priceHistory.data.history.length; i += interval) {
        if (priceHistory.data.history[i].price !== null) {
            price.push(parseInt((priceHistory.data.history[i].price)).toFixed(2));
            dates.push(convertTimeStampToDate(priceHistory.data.history[i].timestamp * 1000));
        } else {
            // if price is null get next not null value
            for (var j = i + 1; j < priceHistory.data.history.length; j++) {
                if (priceHistory.data.history[j].price !== null) {
                    price.push(priceHistory.data.history[j].price);
                    dates.push(convertTimeStampToDate(priceHistory.data.history[j].timestamp * 1000));
                    break;
                }
            }
        }
    }
    price = price.reverse();
    dates = dates.reverse();
    createChart(dates, price, chartId);
}

function convertTimeStampToDate(timestamp) {
    //date = new Date(timestamp).toLocaleDateString("en-GB");
    hours = new Date(timestamp).toLocaleTimeString("en-GB");
    return hours;
}
//console.log(favouritesList);

function showFavourites() {
    // Tworzenie okienka z listą ulubionych
    const favouritesElement = document.getElementById("favourites");
    if (!showOnlyFavourites) {
        favouritesElement.innerHTML = "All coins";
        showOnlyFavourites = true;
    } else {
        favouritesElement.innerHTML = "My favourites coins: " + favouritesList.length;
        showOnlyFavourites = false;
    }
    console.log(showOnlyFavourites);
    createCoinsTable(coins);
}

function filterCoinsTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("coinsTableBody");
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[1];
        const name = nameColumn.textContent || nameColumn.innerText;

        if (name.toUpperCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function sortData(data) {
    // Pobranie informacji o aktualnie wybranej kolumnie do sortowania
    const sortColumn = localStorage.getItem("sortColumn") || "rank";
    const sortDirection = localStorage.getItem("sortDirection") || "asc";

    // Sortowanie danych zgodnie z wybranymi parametrami
    const sortedData = [...data].sort((a, b) => {
        if (sortDirection === "asc") {
            return a[sortColumn] - b[sortColumn];
        } else {
            return b[sortColumn] - a[sortColumn];
        }
    });

    return sortedData;
}

function updateSortParams(column) {
    const sortColumn = localStorage.getItem("sortColumn") || "rank";
    const sortDirection = localStorage.getItem("sortDirection") || "asc";

    if (column === sortColumn) {
        // Ta sama kolumna, zmień kierunek sortowania
        const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
        localStorage.setItem("sortDirection", newSortDirection);
    } else {
        // Inna kolumna, ustaw nowe parametry sortowania
        localStorage.setItem("sortColumn", column);
        localStorage.setItem("sortDirection", "asc");
    }

    // Ponowne generowanie tabeli z uwzględnieniem sortowania
    createCoinsTable(coins);
}


function addCoinToFavourites(coinId) {
    let iconElement = document.getElementById(coinId);
    let coinUuid = coinId.replace("icon", "");

    if (iconElement.classList.contains("text-warning")) {
        // Moneta jest już w ulubionych - usuń ją
        let coinIndex = favouritesList.indexOf(coinUuid);
        favouritesList.splice(coinIndex, 1);
        localStorage.favourites = JSON.stringify(favouritesList);
        iconElement.classList.remove("text-warning");
    }
    else {
        // Moneta nie jest jeszcze w ulubionych - dodaj ją
        favouritesList.push(coinUuid);
        console.log(favouritesList);
        localStorage.favourites = JSON.stringify(favouritesList);
        iconElement.classList.add("text-warning");
    }
}


function displayCoinModal(coinId) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '6afc309d1dmsh7a026746a911e83p1b43ecjsndd277c6ce187',
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
    };

    // Pobierz dane monety z API
    fetch('https://coinranking1.p.rapidapi.com/coin/' + coinId + '?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h', options)
        .then(response => response.json())
        .then(response => changeCoinModalData(response.data.coin))
        .catch(err => console.error(err));

    // Wyświetl modal z informacjami o monecie
    const coinModal = new bootstrap.Modal("#coinModal", {
        keyboard: false
    });
    coinModal.show();
}

function changeCoinModalData(coinData) {
    console.log(coinData);

    // Zmiana danych w nagłówku modalu
    const modalHeader = document.getElementById("coinHeader");
    modalHeader.innerHTML = coinData.name;

    // Zmiana danych w treści modalu
    const modalBody = document.getElementById("coinModalBody");
    modalBody.innerHTML = `
        <img src="${coinData.iconUrl}" />
        <p>${coinData.description}</p>
    `;
}

function createChart(dates, data, chartId) {
    new Chart(chartId, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                backgroundColor: "rgba(0,100,0,0.5)",
                borderColor: "rgba(0,0,0,0.1)",
                data: data
            }]
        },
        options: {
            legend: { display: false },
            stacked: false,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Price'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }]
            }
        }
    });
}
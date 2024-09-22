document.addEventListener('DOMContentLoaded', showInfoContent);
//document.addEventListener('DOMContentLoaded', fetchData);
document.getElementById('showInfo').addEventListener('click', showInfoContent);
document.getElementById('showPricesToday').addEventListener("click", showPricesTodayContent);

let data = null;    // Alustetaan muuttuja, johon tallennetaan haettu data
let loading = false; // Hallitsee tilaa, jos dataa haetaan parhaillaan

async function fetchData() {
    //document.getElementById('content').innerHTML =
    //    '<p> Ladataan tietoja... Lataus voi kestää jopa minuutin, sillä palvelin toimii ilmaisella serverillä :)</p>';
    if (!loading && !data) {
        loading = true;
        const apiURL = 'https://proxy-server-electricity.onrender.com/api/prices';
        try {
            const response = await fetch(apiURL);
            if (response.ok) {
                console.log('Fetch successful:', response.status);
                data = await response.json();
                data.prices.reverse(); // Käännetään taulukko, jotta uusin hinta on ensimmäisenä
                return data;
            } else {
                console.error('Fetch error:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            loading = false;
        }
    }
};

function getPricesToday() {
    let pricesToday = [];
    let dateToday = new Date().toLocaleDateString();

    data.prices.forEach(content => {
        let date = new Date(content.startDate).toLocaleDateString();
        if (date === dateToday) {
            let time = new Date(content.startDate).toLocaleTimeString('fi-FI', {
                hour: '2-digit',
                minute: '2-digit'
            });
            let price = new Intl.NumberFormat('us-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(content.price);
            pricesToday.push({
                time: time,
                price: price
            });
        }
    });
    return pricesToday;
}

async function getPricesTodayTable() {
    if (!loading && !data) {
        console.log("Loading data...");
        document.getElementById('content').innerHTML =
            '<p> Ladataan tietoja... Lataus voi kestää jopa minuutin, sillä välityspalvelin toimii ilmaisella serverillä :)</p>';
        data = await fetchData();   // Odottaa, että data on ladattu
    }

    if (data) {

        const table = document.createElement('table');
        table.classList.add('price-table'); // Lisätään luokka taulukolle (CSS)
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Luo taulukon otsikkorivi
        const headerRow = document.createElement('tr');
        const timeHeader = document.createElement('th');
        timeHeader.textContent = 'Klo';
        const priceHeader = document.createElement('th');
        priceHeader.textContent = 'snt/kWh sis alv. (25,5%)';

        headerRow.appendChild(timeHeader);
        headerRow.appendChild(priceHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Lisätään data osuus taulukkoon
        let pricesToday = getPricesToday();
        pricesToday.forEach(content => {
            const row = document.createElement('tr');

            const timeCell = document.createElement('td');
            timeCell.textContent = content.time;

            const priceCell = document.createElement('td');
            priceCell.textContent = content.price;

            row.appendChild(timeCell);
            row.appendChild(priceCell);
            tbody.appendChild(row);
        });

        // Lisää tbody taulukkoon ja aseta sisältö DOM-puuhun
        table.appendChild(tbody);
        return table;
    } else {
        return null;
    }
};

function createPricesTodayChart(canvas) {
    if (!loading && !data) {
        console.log("Loading data...");
        data = fetchData();   // Odottaa, että data on ladattu
    }
    if (data) {
        const pricesToday = getPricesToday();
        const pricesChart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: pricesToday.map(content => content.time),
                datasets: [{
                    label: "Sähkön Spot-Hinta",
                    data: pricesToday.map(content => content.price),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }
}


async function showPricesTodayContent() {

    const pricesTable = await getPricesTodayTable();
    if (pricesTable) {

        // Tyhjennetään 'content' ja liitetään uusi taulukko
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // Tyhjennetään aiempi sisältö
        contentDiv.appendChild(choosePricesDisplay(true));
        contentDiv.appendChild(pricesTable); // Liitetään luotu taulukko DOM:iin
    } else {
        document.getElementById('content').innerHTML = '<p> Tietoja ladataan edelleen. Odota hetki...</p>';
    }
};

document.addEventListener('change', async function (event) {
    if (event.target.name === 'price-display') {
        const contentDiv = document.getElementById('content');
        if (event.target.value === 'table') {
            contentDiv.innerHTML = ''; // Tyhjennetään aiempi sisältö
            contentDiv.appendChild(choosePricesDisplay(true));
            contentDiv.appendChild(await getPricesTodayTable());
        } else if (event.target.value === 'chart') {
            contentDiv.innerHTML = ''; // Tyhjennetään aiempi sisältö
            contentDiv.appendChild(choosePricesDisplay(false));

            const canvas = document.createElement('canvas');
            canvas.id = 'pricesChartCanvas';
            contentDiv.appendChild(canvas);
            createPricesTodayChart(canvas);
        }
    }
});

function choosePricesDisplay(isTable) {
    const div = document.createElement('div');
    div.classList.add('price-display');

    const radio1 = document.createElement('input');
    radio1.type = 'radio';
    radio1.id = 'radio1';
    radio1.name = 'price-display';
    radio1.value = 'table';

    const label1 = document.createElement('label');
    label1.htmlFor = 'radio1';
    label1.textContent = 'Taulukko';

    const radio2 = document.createElement('input');
    radio2.type = 'radio';
    radio2.id = 'radio2';
    radio2.name = 'price-display';
    radio2.value = 'chart';

    const label2 = document.createElement('label');
    label2.htmlFor = 'radio2';
    label2.textContent = 'Kaavio';

    if (isTable) {
        radio1.checked = true;
        radio2.checked = false;
    } else {
        radio1.checked = false;
        radio2.checked = true;
    }

    div.appendChild(radio1);
    div.appendChild(label1);
    div.appendChild(radio2);
    div.appendChild(label2);

    return div;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showInfoContent() {
    const contentDiv = document.getElementById('content');

    contentDiv.innerHTML = `
        <article class="info-class">
            <section>
                <h2>Tietoa Sivustosta</h2>
                <p>Tämä sivusto tarjoaa ajankohtaista tietoa sähkön spot-hinnoista ja auttaa sinua seuraamaan energiankulutustasi.</p>
            </section>
            <section>
                <h2>Sähkön Spot-Hinta</h2>
                <p>Sähkön spot-hinta määräytyy tunneittain ja sen perusteella lasketaan sähkölaskusi.</p>
            </section>
            <section>
                <h2>Sähkölaskun Muodostuminen</h2>
                <p>
                    Sähkölaskusi muodostuu kahdesta osasta, kulutuslaskusta (Sähkön myyjä) sekä sähkönsiirtolaskusta (Paikallinen sähköverkon ylläpitäjä).
                    Siirtomaksuun vaikuttaa sopimuspaikkasi ja sähkönkulutuksesi. Sähkönsiirto on aina kiinteä hinta, joka ei muutu kulutuksen mukaan.
                    <br><br>
                    Kulutuslasku koostuu sopimustyypin mukaan. Yleisimmät ovat Pörssisähkö, kiinteä kWh-sopimus ja Kiinteä kk-maksu.
                    Sekä nykyisin Kiinteä kWh-sopimus, johon lisätään *kulutusvaikutus.
                </p>
                <h2>Sopimustyypit</h2>
                <p>Yleisimmät sopimustyypit</p>
                <h3>Pörssisähkö</h3>
                <ul>
                    <li>Spot-hinta: Käyttötunnin mukainen kWh hinta</li>
                    <li>Perusmaksu: Kiinteä kuukausimaksu</li>
                    <li>Verot: 25,5% (1.9.2024 lähtien, aiemmin 24%)</li>
                </ul>
                <h3>Kiinteä kWh-sopimus</h3>
                <ul>
                    <li>Hinta: Kiinteä hinta per kWh</li>
                    <li>Perusmaksu: Kiinteä kuukausimaksu</li>
                    <li>(Kulutusvaikutus*): Määräytyy kulutuksen spot-hinnan päivän keskiarvon mukaan käytetäänkö sähköä keskiarvoa halvemmilla vai kalliimmilla tunneilla</li>
                    <li>Verot: Sis kWh-hintaan alv. 25,5% (1.9.2024 lähtien, aiemmin 24%)</li>
                </ul>
                <h3>Kiinteä kk-maksu</h3>
                <ul>
                    <li>Hinta: Kiinteä kuukausimaksu</li>
                    <li>Lisäkulut: Sopimuksessa sovitun kulutuskaton ylittävä käyttö</li>
                    <li>Verot: Sis. kiinteään kuukausimaksuun alv. 25,5% (1.9.2024 lähtien, aiemmin 24%)</li>
                </ul>
            </section>
        </article>
    `;
}

document.getElementById('showCalculator').addEventListener('click', showCalculatorSection);
function showCalculatorSection() {
    const contentDiv = document.getElementById('content');
    contentDiv.classList.add('calculator-content');
    contentDiv.innerHTML = "";

    const formHTML = `
        <h2>Sähkön Kilowattituntihinnan Laskuri</h2>
        <section id="calculator-section">
            <p> Tämän laskurin avulla voit laskea aiempien laskujesi keskimääräisen kilowattituntihinnan.
                Sisällytä hintaan koko laskun hinta ja kulutus kilowattitunteina, mahdollinen kuukausimaksu mukaanlukien.
            </p>
            <form>
                <label for="consumption">Kulutus kWh:</label>
                <input id="consumption" type="number">
                
                <label for="priceOfBill">Laskun hinta:</label>
                <input id="priceOfBill" type="number">
                
                <button id="countAveragePricePerKwhButton">Laske</button>
            </form>
        </section>
        <section id="resultSection">
        </section>
    `;


    contentDiv.insertAdjacentHTML('beforeend', formHTML);

    document.getElementById('countAveragePricePerKwhButton').addEventListener('click', function (event) {
        event.preventDefault();
        countAveragePricePerKwh();
    });
}

function countAveragePricePerKwh() {
    const consumption = document.getElementById('consumption').value;
    const priceOfBill = document.getElementById('priceOfBill').value;
    console.log(parseFloat(priceOfBill) / parseFloat(consumption) / 100);

    const averagePricePerKwh = (parseFloat(priceOfBill) / parseFloat(consumption) * 100).toFixed(2);
    const resultSection = document.getElementById('resultSection');
    resultSection.innerHTML = `<p>Keskimääräinen hinta sähkölle on ${averagePricePerKwh} snt/kWh</p>`;
}




datax = {
    prices: [
        {
            price: 7.62,
            startDate: "2024-09-13T21:00:00.000Z",
            endDate: "2024-09-13T22:00:00.000Z"
        },
        {
            price: 9.946,
            startDate: "2024-09-13T20:00:00.000Z",
            endDate: "2024-09-13T21:00:00.000Z"
        },
        {
            price: 12.539,
            startDate: "2024-09-13T19:00:00.000Z",
            endDate: "2024-09-13T20:00:00.000Z"
        },
        {
            price: 13.736,
            startDate: "2024-09-13T18:00:00.000Z",
            endDate: "2024-09-13T19:00:00.000Z"
        },
        {
            price: 23.795,
            startDate: "2024-09-13T17:00:00.000Z",
            endDate: "2024-09-13T18:00:00.000Z"
        },
        {
            price: 27.611,
            startDate: "2024-09-13T16:00:00.000Z",
            endDate: "2024-09-13T17:00:00.000Z"
        },
        {
            price: 23.266,
            startDate: "2024-09-13T15:00:00.000Z",
            endDate: "2024-09-13T16:00:00.000Z"
        },
        {
            price: 23.845,
            startDate: "2024-09-13T14:00:00.000Z",
            endDate: "2024-09-13T15:00:00.000Z"
        },
        {
            price: 27.62,
            startDate: "2024-09-13T13:00:00.000Z",
            endDate: "2024-09-13T14:00:00.000Z"
        },
        {
            price: 27.619,
            startDate: "2024-09-13T12:00:00.000Z",
            endDate: "2024-09-13T13:00:00.000Z"
        },
        {
            price: 31.365,
            startDate: "2024-09-13T11:00:00.000Z",
            endDate: "2024-09-13T12:00:00.000Z"
        },
        {
            price: 31.375,
            startDate: "2024-09-13T10:00:00.000Z",
            endDate: "2024-09-13T11:00:00.000Z"
        },
        {
            price: 36.267,
            startDate: "2024-09-13T09:00:00.000Z",
            endDate: "2024-09-13T10:00:00.000Z"
        },
        {
            price: 40.344,
            startDate: "2024-09-13T08:00:00.000Z",
            endDate: "2024-09-13T09:00:00.000Z"
        },
        {
            price: 31.384,
            startDate: "2024-09-13T07:00:00.000Z",
            endDate: "2024-09-13T08:00:00.000Z"
        },
        {
            price: 43.766,
            startDate: "2024-09-13T06:00:00.000Z",
            endDate: "2024-09-13T07:00:00.000Z"
        },
        {
            price: 44.819,
            startDate: "2024-09-13T05:00:00.000Z",
            endDate: "2024-09-13T06:00:00.000Z"
        },
        {
            price: 31.375,
            startDate: "2024-09-13T04:00:00.000Z",
            endDate: "2024-09-13T05:00:00.000Z"
        },
        {
            price: 19.204,
            startDate: "2024-09-13T03:00:00.000Z",
            endDate: "2024-09-13T04:00:00.000Z"
        },
        {
            price: 15.063,
            startDate: "2024-09-13T02:00:00.000Z",
            endDate: "2024-09-13T03:00:00.000Z"
        },
        {
            price: 17.226,
            startDate: "2024-09-13T01:00:00.000Z",
            endDate: "2024-09-13T02:00:00.000Z"
        },
        {
            price: 16.315,
            startDate: "2024-09-13T00:00:00.000Z",
            endDate: "2024-09-13T01:00:00.000Z"
        },
        {
            price: 16.462,
            startDate: "2024-09-12T23:00:00.000Z",
            endDate: "2024-09-13T00:00:00.000Z"
        },
        {
            price: 19.245,
            startDate: "2024-09-12T22:00:00.000Z",
            endDate: "2024-09-12T23:00:00.000Z"
        },
        {
            price: 12.558,
            startDate: "2024-09-12T21:00:00.000Z",
            endDate: "2024-09-12T22:00:00.000Z"
        },
        {
            price: 13.105,
            startDate: "2024-09-12T20:00:00.000Z",
            endDate: "2024-09-12T21:00:00.000Z"
        },
        {
            price: 15.744,
            startDate: "2024-09-12T19:00:00.000Z",
            endDate: "2024-09-12T20:00:00.000Z"
        },
        {
            price: 31.489,
            startDate: "2024-09-12T18:00:00.000Z",
            endDate: "2024-09-12T19:00:00.000Z"
        },
        {
            price: 49.358,
            startDate: "2024-09-12T17:00:00.000Z",
            endDate: "2024-09-12T18:00:00.000Z"
        },
        {
            price: 31.386,
            startDate: "2024-09-12T16:00:00.000Z",
            endDate: "2024-09-12T17:00:00.000Z"
        },
        {
            price: 31.38,
            startDate: "2024-09-12T15:00:00.000Z",
            endDate: "2024-09-12T16:00:00.000Z"
        },
        {
            price: 18.821,
            startDate: "2024-09-12T14:00:00.000Z",
            endDate: "2024-09-12T15:00:00.000Z"
        },
        {
            price: 16.948,
            startDate: "2024-09-12T13:00:00.000Z",
            endDate: "2024-09-12T14:00:00.000Z"
        },
        {
            price: 17.938,
            startDate: "2024-09-12T12:00:00.000Z",
            endDate: "2024-09-12T13:00:00.000Z"
        },
        {
            price: 14.194,
            startDate: "2024-09-12T11:00:00.000Z",
            endDate: "2024-09-12T12:00:00.000Z"
        },
        {
            price: 12.67,
            startDate: "2024-09-12T10:00:00.000Z",
            endDate: "2024-09-12T11:00:00.000Z"
        },
        {
            price: 12.338,
            startDate: "2024-09-12T09:00:00.000Z",
            endDate: "2024-09-12T10:00:00.000Z"
        },
        {
            price: 11.303,
            startDate: "2024-09-12T08:00:00.000Z",
            endDate: "2024-09-12T09:00:00.000Z"
        },
        {
            price: 13.442,
            startDate: "2024-09-12T07:00:00.000Z",
            endDate: "2024-09-12T08:00:00.000Z"
        },
        {
            price: 18.161,
            startDate: "2024-09-12T06:00:00.000Z",
            endDate: "2024-09-12T07:00:00.000Z"
        },
        {
            price: 16.315,
            startDate: "2024-09-12T05:00:00.000Z",
            endDate: "2024-09-12T06:00:00.000Z"
        },
        {
            price: 10.005,
            startDate: "2024-09-12T04:00:00.000Z",
            endDate: "2024-09-12T05:00:00.000Z"
        },
        {
            price: 1.685,
            startDate: "2024-09-12T03:00:00.000Z",
            endDate: "2024-09-12T04:00:00.000Z"
        },
        {
            price: 0.056,
            startDate: "2024-09-12T02:00:00.000Z",
            endDate: "2024-09-12T03:00:00.000Z"
        },
        {
            price: 0,
            startDate: "2024-09-12T01:00:00.000Z",
            endDate: "2024-09-12T02:00:00.000Z"
        },
        {
            price: -0.001,
            startDate: "2024-09-12T00:00:00.000Z",
            endDate: "2024-09-12T01:00:00.000Z"
        },
        {
            price: -0.001,
            startDate: "2024-09-11T23:00:00.000Z",
            endDate: "2024-09-12T00:00:00.000Z"
        },
        {
            price: 0,
            startDate: "2024-09-11T22:00:00.000Z",
            endDate: "2024-09-11T23:00:00.000Z"
        }
    ]
}

class PriceAnalyzer {
    constructor(priceData) {
        this.priceData = priceData;
    }

    // Palauttaa keskiarvon hinnasta
    calculateAveragePrice() {
        let sum = 0;
        this.priceData.forEach(content => {
            sum += parseFloat(content.price);
        })
        const averagePrice = parseFloat(sum) / this.priceData.length;
        return averagePrice;


    }

    // Palauttaa päivän suurimman hinnan ja indexin
    calculateHighestPrice() {
        let highestPrice = 0;
        let highestPriceTime = '';
        this.priceData.forEach(content => {
            if (parseFloat(content.price) > highestPrice) {
                highestPrice = parseFloat(content.price);
                highestPriceTime = content.time;
            }
        })
        return { highestPriceTime, highestPrice };
    }
}


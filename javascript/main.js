document.addEventListener('DOMContentLoaded', showInfoContent);

// Hakee sähkön hinta dataa API:sta
async function fetchData() {
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
    //}
};

// Palauttaa taulukon kuluvan päivän tuntihinnoista
async function getPricesToday() {
    const data = await fetchData();
    let pricesToday = [];
    let dateToday = new Date().toLocaleDateString();

    data.prices.forEach(content => {
        let date = new Date(content.startDate).toLocaleDateString();
        if (date === dateToday) {
            let time = new Date(content.startDate).toLocaleTimeString('fi-FI', {
                hour: '2-digit',
                minute: '2-digit'
            });
            // Hinta kaaviolle täytyy olla muodossa 0.00
            let price = new Intl.NumberFormat('en-US', {
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

// Luo taulukon sähkön hinnoista
async function createPricesTodayTable() {
    const pricesToday = await getPricesToday();
    if (pricesToday) {
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

// Luo kaavion sähkön hinnoista
async function createPricesTodayChart() {
    const pricesToday = await getPricesToday();
    const canvas = document.createElement('canvas');
    canvas.id = 'pricesChartCanvas';
    const contentDiv = document.getElementById('content');
    contentDiv.appendChild(canvas);
    const pricesChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: pricesToday.map(content => content.time),
            datasets: [{
                label: "Sähkön Spot-Hinta sis alv 25,5%",
                data: pricesToday.map(content => content.price),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMin: 0
                }
            }
        }
    });
}

document.getElementById('showPricesToday').addEventListener("click", showPricesTodayContent);
async function showPricesTodayContent() {
    document.getElementById('content').innerHTML = '<p>Ladataan...</p>';
    const pricesTable = await createPricesTodayTable();
    if (pricesTable) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // Tyhjennetään aiempi sisältö
        contentDiv.appendChild(choosePricesDisplay(true));
        contentDiv.appendChild(pricesTable); // Liitetään luotu taulukko DOM:iin
    }
};

// Vaihtaa näkymää taulukon ja kaavion välillä
document.addEventListener('change', async function (event) {
    if (event.target.name === 'price-display') {
        const contentDiv = document.getElementById('content');
        if (event.target.value === 'table') {
            contentDiv.innerHTML = ''; // Tyhjennetään aiempi sisältö
            showPricesTodayContent();
        } else if (event.target.value === 'chart') {
            contentDiv.innerHTML = ''; // Tyhjennetään aiempi sisältö
            contentDiv.appendChild(choosePricesDisplay(false));
            createPricesTodayChart();
        }
    }
});

// Alustaa radio-napit taulukon ja kaavion valitsemiseen
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

document.getElementById('showInfo').addEventListener('click', showInfoContent);
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

    if (consumption === '' || priceOfBill === '') {
        resultSection.innerHTML = '<p>Syötä kulutus ja laskun hinta</p>';
    } else {
        const averagePricePerKwh = (parseFloat(priceOfBill) / parseFloat(consumption) * 100).toFixed(2);
        const resultSection = document.getElementById('resultSection');
        resultSection.innerHTML = `<p>Keskimääräinen hinta sähkölle on ${averagePricePerKwh} snt/kWh</p>`;
    }
}

// Kellonajan näyttäminen
setInterval(myTimer, 1000);
function myTimer() {
    const d = new Date();
    document.getElementById("clock").innerHTML = d.toLocaleTimeString('fi-FI', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

class PriceAnalyzer {
    constructor(priceData) {
        this.priceData = priceData;
    }

    // Palauttaa keskiarvon hinnasta
    getAveragePrice() {
        let sum = 0;
        this.priceData.forEach(content => {
            sum += parseFloat(content.price);
        })
        const averagePrice = parseFloat(sum) / this.priceData.length;
        return averagePrice;
    }

    // Palauttaa päivän suurimman hinnan ja indexin
    getHighestPrice() {
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


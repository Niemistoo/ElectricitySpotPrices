class PriceAnalyzer {
    constructor(priceData) {
        this.priceData = priceData;
    }

    // Palauttaa keskiarvon hinnasta
    calculateAveragePrice() {
        const total = this.priceData.reduce((sum, price) => sum + price, 0);
        console.log(total / this.priceData.length);
        return total / this.priceData.length;
    } 

    // Palauttaa päivän suurimman hinnan ja indexin
    calculateHighestPrice() {
        let highestPrice = 0;
        let highestPriceTime = '';
        this.priceData.forEach((price, index) => {
            if (price > highestPrice) {
                highestPrice = price;
                highestPriceTime = index;
            }
        return { highestPrice, highestPriceTime };
        })
    }
}
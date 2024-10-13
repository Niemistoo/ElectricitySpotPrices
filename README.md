# Web-Ohjelmoinnin Perusteet

## About
ElectricitySpotPrices is my assignment for the Web-Ohjelmoinnin Perusteet course. This static webpage fetches electricity spot-prices of the current day and represents those for the visitor. Page is created by principle of Single-Page-Application.

>[!IMPORTANT]
Content may load slowly at first, because there is private proxy-server that routes the fetch. Loading data may take up to 1-2 minutes if not used recently. All the data is originally fetched from open API https://api.porssisahko.net/v1/latest-prices.json via https://proxy-server-electricity.onrender.com/api/prices

The Idea for the topic of the page came from that I wanted to create something useful and that I can include all the required elements to be present for the grading. The grading requirements are listed below.

Link to my website: https://niemistoo.github.io/ElectricitySpotPrices/

## HTML
Part of the HTML is loaded by JavaScript

1. - [x] Basic HTML Structure is present
    - Check HTML
2. - [x] HTML structure with clear content differentiation (headings, paragraphs, lists)
    - Check HTML
3. - [x] Use of forms, links, and media
    - Page has a favicon. Footer has an image and link, Theme toggle have two images. Laskuri has a form
4. - [x] Tables are effectively used
    - Päivänhinnat -> Taulukko is created to table
5. - [x] Consistent use of semantic HTML throughout, ensuring better structure and understanding of the content
    - Check HTML

## CSS

1. - [x] Basic CSS styling (colors, fonts)
    - Check CSS
2. - [x] Use of classes and IDs to style specific elements
    - Check HTML and CSS. Almost all semantic elements
3. - [x] Implementation of responsive desing elements
    - Theme mode in navbar. Hover over navbar buttons and Price Table items
4. - [x] Use of layouts for advanced user interfaces (arrays, float, flexbox, css grid)
    - Flex: Body, Theme-toggle items, 'price-display' radiobuttons
5. - [x] Styling demonstrates a strong grasp of layout principles, aesthetics, and user experience
    - Well, that's just your opinion Dude

## JavaScript Basics

1. - [x] Simple interactions (like alerts on button click)
    - All the main content is loaded by buttons in navbar
2. - [x] Multiple event listeners and basic DOM manipulations
    - Check JavaScript
3. - [x] Use of array, objects, and functions
    - Price data is loaded to json object and current day data is sorted to array
4. - [x] Advanced logic, looping through data, and dynamic DOM updates
    - Looping through current day price data in main.js. Table and Chart are created by appending DOM-elements into parent elements
5. - [x] Consistent use of Object-Oriented JavaScript principles
    - Functions are used constantly and class PriceAnalyser is created for an example and future use

## Asynchronous Operations

1. - [x] Use of timers
    - Navbar clock functions as a timer. Check js
2. - [x] Successful implementation of an AJAX call or fetch
    - Price data is fetched through my proxy app from public API
3. - [x] Data from the asynchronous call is displayed on the webpage
    - Päivän Tuntihinnat Price table and Price chart are fetched data
4. - [x] Error handling is implemented (for failed API calls, etc.)
    - Check JavaScript fetchData -function
5. - [x] Effective use of asynchronous data to enhance user experience (like filtering, sorting)
    - Data is converted to json Object and array. Data is projected as Päivän Tuntihinnat content

# Other

Data is fetched from https://api.porssisahko.net/v1/latest-prices.json. Code uses proxy-server because of CORS-handling.

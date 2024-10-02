# Web-Ohjelmoinnin Perusteet

## About
ElectricitySpotPrices is my assignment for the Web-Ohjelmoinnin Perusteet course. This static webpage fetches electricity spot-prices for the current day and represents those for the visitor. 

>[!IMPORTANT]
Content may load slowly at first, because there is private proxy-server that routes the fetch. Loading data may take up to 1-2 minutes if not used recently. All the data is originally fetched from open API https://api.porssisahko.net/v1/latest-prices.json via https://proxy-server-electricity.onrender.com/api/prices

The Idea for the topic of the page came from that I wanted it to be useful and that I can include all the required elements to be present for the grading. The grading requirements are listed below. You can use the checkboxes to keep count of the found requirements.

## HTML

Most of these requirements are present in html file. The 4th requirement (efficient use of tables) is inserted to DOM-tree from javascript file when "Päivän Tuntihinnat" is clicked. This can be easily viewed in the browsers developer tools when the previously mentioned button is pressed. There is also a chart option (canvas). As semantic elements there are header, main, aside, article, nav... etc.

1. - [ ] Basic HTML Structure is present
2. - [ ] HTML structure with clear content differentiation (headings, paragraphs, lists)
3. - [ ] Use of forms, links, and media
4. - [ ] Tables are effectively used
5. - [ ] Consistent use of semantic HTML throughout, ensuring better structure and understanding of the content

## CSS

These requirements can be easily found in style.css file. Responsive desing elements are used in buttons and table as hovering (.css row 73, 123). Flexboxes are used in several cases for example, aside navigation area and calculator (.css row 33, 164)

1. - [ ] Basic CSS styling (colors, fonts)
2. - [ ] Use of classes and IDs to style specific elements
3. - [ ] Implementation of responsive desing elements
4. - [ ] Use of layouts for advanced user interfaces (arrays, float, flexbox, css grid)
5. - [ ] Styling demonstrates a strong grasp of layout principles, aesthetics, and user experience

## JavaScript Basics

These requirements can be found in main.js. As interactions there are buttons that load contents for the main content section. These also checks the event listener requirement. For example, showInfoContent, showPricesTodayContent, showCalculatorSection (main.js, row 193, 125, 242).
Arrays, objects and functions are repeatedly present in JS-file. Additionally there are Object-Oriented JS principles used in class PrizeAnalyzer (main.js, row 301)

1. - [ ] Simple interactions (like alerts on button click)
2. - [ ] Multiple event listeners and basic DOM manipulations
3. - [ ] Use of array, objects, and functions
4. - [ ] Advanced logic, looping through data, and dynamic DOM updates
5. - [ ] Consistent use of Object-Oriented JavaScript principles

## Asynchronous Operations

Timer is used inside the aside navigation bar on the left of the page. (main.js, row 290).
Fetch and asynchronous calls are used for fetching the electricity prices (main.js, row 3). 
There are several cases that async/await is used in the functions(main.js, row 25, 52, 96).
Error handling is also implemented in fetch (main.js, row 3).
As effective use of asynchronous data can be found in (main.js, row 52, 96). The data is used to create table and chart of the prices.


1. - [ ] Use of timers
2. - [ ] Successful implementation of an AJAX call or fetch
3. - [ ] Data from the asynchronous call is displayed on the webpage
4. - [ ] Error handling is implemented (for failed API calls, etc.)
5. - [ ] Effective use of asynchronous data to enhance user experience (like filtering, sorting)

# Other

Data is fetched from https://api.porssisahko.net/v1/latest-prices.json. Code uses proxy-server between because of CORS-handling.
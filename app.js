var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var createProduct = require('./Product.js')
var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

var mwsProd = require('mws-product');
var aws = mwsProd({
    auth: {
        sellerId: 'A2G2BEQVIN0KXR',
        accessKeyId: 'AKIAJO5QT6SVQOMSJKZQ',
        secretKey: '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'
    },
    marketplace: 'US'
});





function getProductArrayfromQuery(data, done) {
    var newDataSet = [];
    var product = data.shift()
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    product = data.shift()
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    product = data.shift()  
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    product = data.shift()  
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    product = data.shift()  
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    product = data.shift()  
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    product = data.shift()  
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    product = data.shift()  
    scrapeProductData(product, function(err, newDataJSON) {
        console.log("pushing new data json")
        console.log(newDataJSON)
        newDataSet.push(newDataJSON)
    })

    setTimeout(function() {
        done(null, newDataSet)
    }, 10000)


}

function scrapeProductData(data, callback) {
    var asin = data.Identifiers.MarketplaceASIN.ASIN;
    var url = 'http://www.amazon.com/dp/' + asin;

    request(url, function(error, response, html) {

       

        var url = 'http://www.amazon.com/dp/' + asin;
       
        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);
            // Finally, we'll define the variables we're going to capture
            var title, rating, ranking, price;

            // We'll use the unique header class as a starting point.
            $('#SalesRank').filter(function() {
                // Let's store the data we filter into a variable so we can easily see what's going on.
                // var data = $(this);
                var rank = $(this);
                ranking = rank.text().replace(/(\r\n|\n|\r)/gm,"").trim();

                // In examining the DOM we notice that the title rests within the first child element of the header tag. 
                // Utilizing jQuery we can easily navigate and get the text by writing the following code:
                // title = data.children().first().text();
                // Once we have our title, we'll store it to the our json object.
                // Once again, once we have the data extract it we'll save it to our json object
                // json.ranking = ranking;
            })
            // Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.
            $('.crAvgStars').filter(function() {
                var rate = $(this);
                // The .star-box-giga-star class was exactly where we wanted it to be.
                // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further
                rating = rate.text().replace(/(\r\n|\n|\r)/gm,"").trim();
                // json.rating = rating;
            })

            
            if (!data.AttributeSets['ns2:ItemAttributes']['ns2:ListPrice']) {

                // JQuery.exists = function(selector){return ($(this).length>0);}

                // if($('#price').exists()){
                //     $('#price').filter(function() {
                //         var value = $(this);
                //         price = value.text();
                //     })
                // } else{
                //     $('.a-color-price').filter(function() {
                //         var value = $(this)
                //         price = value.text();
                //     })
                // }
                
                if ($('#price').length) {
                    $('#price').filter(function() {
                        var value = $(this);
                        price = value.text().replace(/(\r\n|\n|\r)/gm,"").trim();
                    })
                } else {


                    $('#unqualifiedBuyBox').find('.a-color-price').filter(function() {
                        var value = $(this)
                        price = value.text().replace(/(\r\n|\n|\r)/gm,"").trim();
                    })
                }

                var json = {
                    title: data.AttributeSets['ns2:ItemAttributes']['ns2:Title'],
                    brand: data.AttributeSets['ns2:ItemAttributes']['ns2:Brand'],
                    price: price,
                    ranking: ranking,
                    rating: rating,
                    asin: data.Identifiers.MarketplaceASIN.ASIN
                }

            } else {

                var json = {
                    title: data.AttributeSets['ns2:ItemAttributes']['ns2:Title'],
                    brand: data.AttributeSets['ns2:ItemAttributes']['ns2:Brand'],
                    price: data.AttributeSets['ns2:ItemAttributes']['ns2:ListPrice']['ns2:Amount'],
                    ranking: ranking,
                    rating: rating,
                    asin: data.Identifiers.MarketplaceASIN.ASIN
                }


            }
            callback(null, json)
        } else {
            console.log("ERROR OTHER SHIT")
        }

    })
}


app.post('/query', function(req, res) {

    var theQuery = req.body.query;
  
    aws.matchingProducts({
        query: theQuery,
        queryContextId: 'All'
    }, function(err, data) {
        data = data.ListMatchingProductsResponse.ListMatchingProductsResult[0].Products.Product;
        if (!err) {
            getProductArrayfromQuery(data, function(err, newDataSet) {
                console.log("This is the new data set")
                // res.json(newDataSet)
            })

        } else {
            console.log(err);
        }
    });
});


exports = module.exports = app;
// app.get('/scrape', function(req, res) {
//             // The URL we will scrap from 
//             // need to apend the ASIN number somehow to the url
//             // For now lets just run the test and use the URL 
//             url = 'http://www.amazon.com/dp/' + asinNumber; // <= Here I need to figure out how to insert the ASIN
//             console.log(url)
//             // The structure of our request call
//             // The first parameter is our URL
//             // The callback function takes 3 parameters, an error, response status code and the html

//             request(url, function(error, response, html) {

//                 // First we'll check to make sure no errors occurred when making the request

//                 if (!error) {
//                     // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

//                     var $ = cheerio.load(html);

//                     // Finally, we'll define the variables we're going to capture

//                     var title, release, rating, ranking;
//                     var json = {
//                         ranking: "",
//                         rating: ""
//                     };

//                     // We'll use the unique header class as a starting point.

//                     $('.zg_hrsr').filter(function() {
//                         // Let's store the data we filter into a variable so we can easily see what's going on.

//                         var data = $(this);
//                         // In examining the DOM we notice that the title rests within the first child element of the header tag. 
//                         // Utilizing jQuery we can easily navigate and get the text by writing the following code:

//                         title = data.children().first().text();
//                         // Once we have our title, we'll store it to the our json object.

//                         json.title = title;
//                         // Once again, once we have the data extract it we'll save it to our json object

//                         json.ranking = ranking;
//                     })

//                     // Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.

//                     $('.crAvgStars').filter(function() {
//                         var data = $(this);
//                         // The .star-box-giga-star class was exactly where we wanted it to be.
//                         // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

//                         rating = data.text();
//                         json.rating = rating;
//                     })

//                 }
//                 // To write to the system we will use the built in 'fs' library.
//                 // In this example we will pass 3 parameters to the writeFile function
//                 // Parameter 1 :  output.json - this is what the created filename will be called
//                 // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
//                 // Parameter 3 :  callback function - a callback function to let us know the status of our function

//                 fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

//                     console.log('File successfully written! - Check your project directory for the output.json file');

//                 })

//                 // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
//                 res.send('Check your console!')


//             });
//         })



// app.get('/matchingProducts', function(req, res) {
//     var data = {};
//     aws.matchingProducts({
//         query: 'Yoga Mat',
//         queryContextId: 'All'
//     }, function(err, data) {
//         if (!err) {
//             data = data;
//             res.json(data);
//         } else {
//             console.log(err);
//         }
//     });
// });

// app.post('/scrape', function(req, res) {
//         var theQuery = req.body.query;
//         // The URL we will scrap from 
//         // need to apend the ASIN number somehow to the url
//         // For now lets just run the test and use the URL 
//         url = 'http://www.amazon.com/dp/B013TWH508'; // <= Here I need to figure out how to insert the ASIN

//         // The structure of our request call
//         // The first parameter is our URL
//         // The callback function takes 3 parameters, an error, response status code and the html

//         request(url, function(error, response, html) {

//                 // First we'll check to make sure no errors occurred when making the request

//                 if (!error) {
//                     // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

//                     var $ = cheerio.load(html);

//                     // Finally, we'll define the variables we're going to capture

//                     var title, release, rating, ranking;
//                     var json = {
//                         ranking: "",
//                         rating: ""
//                     };

//                     // We'll use the unique header class as a starting point.

//                     $('.zg_hrsr').filter(function() {
//                         // Let's store the data we filter into a variable so we can easily see what's going on.

//                         var data = $(this);
//                         // In examining the DOM we notice that the title rests within the first child element of the header tag. 
//                         // Utilizing jQuery we can easily navigate and get the text by writing the following code:

//                         title = data.children().first().text();
//                         // Once we have our title, we'll store it to the our json object.

//                         json.title = title;
//                         // Once again, once we have the data extract it we'll save it to our json object

//                         json.ranking = ranking;
//                     })

//                     // Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.

//                     $('.crAvgStars').filter(function() {
//                         var data = $(this);
//                         // The .star-box-giga-star class was exactly where we wanted it to be.
//                         // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

//                         rating = data.text();
//                         json.rating = rating;
//                     })

//                 }
//                 // To write to the system we will use the built in 'fs' library.
//                 // In this example we will pass 3 parameters to the writeFile function
//                 // Parameter 1 :  output.json - this is what the created filename will be called
//                 // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
//                 // Parameter 3 :  callback function - a callback function to let us know the status of our function

//                 fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

//                     console.log('File successfully written! - Check your project directory for the output.json file');

//                 })

//                 // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
//                 res.send('Check your console!')


//                 });
//     })

// app.get('/matchingProductForId', function(req, res) {
//     var data = {};
//     var mwsProd = require('mws-product');
//     var aws = mwsProd({
//         auth: {
//             sellerId: 'A2G2BEQVIN0KXR',
//             accessKeyId: 'AKIAJO5QT6SVQOMSJKZQ',
//             secretKey: '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'
//         },
//         marketplace: 'US'
//     });

//     aws.matchingProductForId({
//         idType: 'ASIN',
//         idList: ['B00MNNZMUA','B018QLQZRQ','B00RVGB6D6']},
//      function(err, data) {
//         if (!err) {
//             data = data;
//             res.json(data);
//         } else {
//             console.log(err);
//         }
//     });
// });
/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// import { SeatType } from "./prisma";

// Select the database to use.
use("test");

// db.getCollection("User").insert([
//   {
//     email: "jhon.doe@gee.com",
//     tickets: [null],
//   },
// ]);

// db.getCollection("Ticket").insertMany([{}]);

// Insert a few documents into the sales collection.
db.getCollection("Connection").insertMany([
  {
    name: "Jupiter",
    capacity: [
      { available: 10, booked: 0, type: COMPARTMENT },
      { available: 12, booked: 0, type: OPEN },
    ],
    tickets: [null],
    departure: new Date("2029-03-01T08:00:00Z"),
    departureStation: "Mars",
    arrivalStation: "Jupiter",
    arrival: new Date("2030-03-01T08:00:00Z"),
    price: 1000000000000,
  },
]);

// // Run a find command to view items sold on April 4th, 2014.
// const salesOnApril4th = db
//   .getCollection("sales")
//   .find({
//     date: { $gte: new Date("2014-04-04"), $lt: new Date("2014-04-05") },
//   })
//   .count();

// // Print a message to the output window.
// console.log(`${salesOnApril4th} sales occurred in 2014.`);

// // Here we run an aggregation and open a cursor to the results.
// // Use '.toArray()' to exhaust the cursor to return the whole result set.
// // You can use '.hasNext()/.next()' to iterate through the cursor page by page.
// db.getCollection("sales").aggregate([
//   // Find all of the sales that occurred in 2014.
//   {
//     $match: {
//       date: { $gte: new Date("2014-01-01"), $lt: new Date("2015-01-01") },
//     },
//   },
//   // Group the total sales for each product.
//   {
//     $group: {
//       _id: "$item",
//       totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
//     },
//   },
// ]);
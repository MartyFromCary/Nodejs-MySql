const prompt = require("inquirer").prompt;
const conn = require("./connect");

function formatPrice(price) {
  let P = Math.floor(parseFloat(price) * 100).toString();
  let decimalPos = P.length - 2;

  return P.substr(0, decimalPos) + "." + P.substr(decimalPos);
}

const columnNames = [
  "item_id",
  "product_name",
  "department_name",
  "price",
  "stock_quantity"
];

const queryBasic = "SELECT " + columnNames.join(",") + " FROM products";
const queryAll = queryBasic + " ORDER BY item_id ASC";
const queryLow = queryBasic + " WHERE stock_quantity < 5 ORDER BY item_id ASC";

const viewProductsForSaleTXT = "View Products for Sale";
const viewLowInventoryTXT = "View Low Inventory";
const addToInventoryTXT = "Add to Inventory";
const addNewProductTXT = "Add New Product";
const wantToQuitTXT = "QUIT";

const actionChoices = [
  viewProductsForSaleTXT,
  viewLowInventoryTXT,
  addToInventoryTXT,
  addNewProductTXT,
  wantToQuitTXT
];

function formatTupleToDisplay(tuple) {
  let tupleDisplay = [];
  columnNames.forEach(name => {
    let column = tuple[name];
    if (name === "price") {
      column = "$" + formatPrice(column);
    }
    tupleDisplay.push(column);
  });
  return tupleDisplay.join("|  ");
}

function formatDisplayToTuple(display) {
  let tuple = {};
  let parts = display.split("|").map(S => S.trim());
  columnNames.forEach(name => {
    let column = parts.shift();
    if (name === "price") {
      column = parseFloat(column.substr(1));
    }
    tuple[name] = column;
  });
  return tuple;
}

function viewProducts(queryType) {
  conn.query(queryType, (err, res) => {
    if (err) throw err;
    console.log(columnNames.join("|  ")); // print title line
    res.forEach(tuple => console.log(formatTupleToDisplay(tuple)));
    askWhatDoYouWant();
  });
}

function updateStock_quantity(item_id, stock_quantity, add_quantity) {
  console.log(item_id, stock_quantity, add_quantity);
  conn.query(
    "UPDATE products SET ? WHERE ?",
    [
      { stock_quantity: parseInt(stock_quantity) + parseInt(add_quantity) },
      { item_id }
    ],
    (err, res) => {
      if (err) throw err;
      askWhatDoYouWant();
    }
  );
}

function addToInventory() {
  conn.query(queryAll, (err, res) => {
    if (err) throw err;
    let choices = [];
    res.forEach(tuple => choices.push(formatTupleToDisplay(tuple)));
    prompt([
      {
        name: "display",
        type: "list",
        choices: choices,
        message: "To which item do you want to add inventory?"
      },
      {
        name: "add_quantity",
        type: "input",
        message: "What is the change of stock quantity?"
      }
    ]).then(({ display, add_quantity }) => {
      let T = formatDisplayToTuple(display);
      updateStock_quantity(T.item_id, T.stock_quantity, add_quantity);
    });
  });
}

function askWhatDoYouWant() {
  prompt([
    {
      name: "choice",
      type: "list",
      choices: actionChoices,
      message: "What do you want to do?"
    }
  ]).then(({ choice }) => {
    console.log(choice);
    switch (choice) {
      case viewProductsForSaleTXT:
        return viewProducts(queryAll);
      case viewLowInventoryTXT:
        return viewProducts(queryLow);
      case addToInventoryTXT:
        return addToInventory();
      case addNewProductTXT:
        return;
      case wantToQuitTXT:
        return conn.end();
    }
  });
}

conn.connect();
askWhatDoYouWant();

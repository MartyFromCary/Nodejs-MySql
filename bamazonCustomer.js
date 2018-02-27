const prompt = require("inquirer").prompt;
const conn = require("./connect");

conn.connect();

function formatPrice(price) {
  let P = Math.floor(parseFloat(price) * 100).toString();
  let decimalPos = P.length - 2;

  return P.substr(0, decimalPos) + "." + P.substr(decimalPos);
}
function askGoOn() {
  prompt([
    {
      name: "go_on",
      type: "confirm",
      message: "Would you like to continue"
    }
  ]).then(({ go_on }) => {
    if (go_on) {
      askDepartment();
    } else {
      conn.end();
    }
  });
}

function purchaseItem(item_id, product_name, price, quantity, stock_quantity) {
  console.log(
    `${item_id}, ${product_name}, ${price}, ${quantity}, ${stock_quantity}`
  );
  conn.query(
    "UPDATE products SET ? WHERE ?",
    [{ stock_quantity: stock_quantity - quantity }, { item_id }],
    (err, res) => {
      if (err) throw err;
      console.log(
        `You have purchased ${quantity} ${product_name}(s) @ $${formatPrice(
          price
        )}`
      );
      console.log(`You will be charged: $${formatPrice(quantity * price)}`);
      askGoOn();
    }
  );
}

function askHowMany(item_id, product_name, price) {
  conn.query(
    "SELECT stock_quantity FROM products WHERE ?",
    [{ item_id }],
    (err, res) => {
      if (err) throw err;
      const { stock_quantity } = res[0];
      console.log(stock_quantity);
      prompt([
        {
          name: "quantity",
          type: "input",
          message: `How many ${product_name}(s) would "you like to order?\n${stock_quantity} are available.`
        }
      ]).then(({ quantity }) => {
        console.log(quantity);
        if (quantity <= stock_quantity) {
          purchaseItem(item_id, product_name, price, quantity, stock_quantity);
        } else {
          console.log("Sorry, Insufficient quantity avaialable!");
          askGoOn();
        }
      });
    }
  );
}

function askItem(department_name) {
  conn.query(
    "SELECT item_id,product_name,price FROM products WHERE ? AND stock_quantity > 0",
    [{ department_name }],
    (err, res) => {
      if (err) throw err;
      prompt([
        {
          name: "item_name",
          type: "list",
          choices: res.map(
            tuple =>
              tuple.item_id +
              ",  " +
              tuple.product_name +
              ",  $" +
              formatPrice(tuple.price)
          ),
          message: `Witch item from the ${department_name} Department would you like to order?`
        }
      ]).then(({ item_name }) => {
        let tmpArr = item_name.split(",").map(S => S.trim());
        askHowMany(
          tmpArr.shift(), // item_id
          tmpArr.shift(), // product_name
          parseFloat(tmpArr.shift().substr(1)) //price
        );
      });
    }
  );
}

function askDepartment() {
  conn.query(
    "SELECT DISTINCT department_name FROM products WHERE stock_quantity > 0 ORDER BY department_name ASC",
    (err, res) => {
      if (err) throw err;
      prompt([
        {
          name: "department_name",
          type: "list",
          choices: res.map(tuple => tuple.department_name),
          message: "From which department would you like to order?"
        }
      ]).then(({ department_name }) => {
        askItem(department_name);
      });
    }
  );
}

askDepartment();

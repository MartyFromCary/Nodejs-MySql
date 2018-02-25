DROP TABLE if exists products;

CREATE TABLE products (
    item_id INTEGER NOT NULL UNIQUE,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price FLOAT NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products
(item_id,product_name,department_name,price,stock_quantity)
VALUES
(4711,  "Cargo Pants",          "Mens Wear",      20.99,    40),
(4712,  "Skirt",                "Womans Wear",    59.99,    20),
(4713,  "Onesy",                "Babies Wear",    19.95,    30),
(4714,  "Dinette Set",          "Furniture",     249.99,    10),
(4715,  "Pool Table",           "Furniture",     500.00,    15),
(4716,  "Entertainment Center", "Furniture",    1500.00,    20),
(4717,  "Tank Top",             "Mens Wear",      12.98,    20),
(4718,  "Ladies Shoes",         "Shoes",          15,95,    12);

select * from products;

USE bamazon;
DROP TABLE if exists products;

CREATE TABLE products (
    item_id INTEGER NOT NULL UNIQUE,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price FLOAT(8,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
    
);

INSERT INTO products
(item_id,product_name,department_name,price,stock_quantity)
VALUES
(4711,  "Cargo Pants",          "Mens Wear",      20.99,    4),
(4712,  "Skirt",                "Womans Wear",    59.99,    8),
(4713,  "Onesy",                "Babies Wear",    19.95,    7),
(4714,  "Dinette Set",          "Furniture",     249.99,    2),
(4715,  "Pool Table",           "Furniture",     500.00,    6),
(4716,  "Entertainment Center", "Furniture",    1500.00,    2),
(4717,  "Tank Top",             "Mens Wear",      12.98,    8),
(4718,  "Ladies Shoes",         "Shoes",          15.95,    5),
(4719,  "Mens Sandals",         "Shoes",          12.00,    4),
(4720,  "Barbie Doll",          "Toys",           15.00,    2),
(4721,  "Camping Tent",         "Outdoor",       125.98,    9),
(4722,  "Charcoal Grill",       "Outdoor",       119.98,    3),
(4723,  "Baby Jacket",          "Babies Wear",    12.98,    2),
(4724,  "Spider Man Action Figure","Toys",        11.50,    6);

select * from products;

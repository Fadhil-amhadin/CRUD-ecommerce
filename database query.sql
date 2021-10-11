CREATE DATABASE db_ecommerce;

USE db_ecommerce;

CREATE TABLE tb_user(
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50),
	password VARCHAR(50),
	address TEXT,
	status BIT(2),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE tb_category(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE tb_brand(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE tb_product(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
	description TEXT,
	price DOUBLE,
	photo TEXT,
	stock INT,
	brand_id INT,
	category_id INT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (brand_id) REFERENCES tb_brand(id) ON DELETE SET NULL,
	FOREIGN KEY (category_id) REFERENCES tb_category(id)ON DELETE SET NULL);

CREATE TABLE tb_transactions(
	id INT AUTO_INCREMENT PRIMARY KEY,
	sub_total DOUBLE,
	product_id INT,
	user_id INT,
	update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (product_id) REFERENCES tb_product(id) ON DELETE SET NULL,
	FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE SET NULL);

CREATE TABLE tb_payment(
	id INT AUTO_INCREMENT PRIMARY KEY,
	qty INT,
	sub_total DOUBLE,
	transaction_id INT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (transaction_id) REFERENCES tb_transactions(id) ON DELETE SET NULL);

--Inserting a data
INSERT INTO tb_user(email, password, address, status) VALUES('fadhilamhadin@gmail.com','12345678','Wajo South Sulawesi',1);

INSERT INTO tb_category(name) VALUES ('laptop');

INSERT INTO tb_brand(name) VALUES ('lenovo');

INSERT INTO tb_product(name, description, price, photo, stock, brand_id, category_id) VALUES ('Lenovo ThinkPad x1 Carbon','With its stunning, new look, the ultralight ThinkPad X1 Carbon merges elegant design, seamless responsiveness, and legendary durability to create the ultimate in mobile productivity. Global LTE-A connectivity option,up to 15 hours of battery life—along with RapidCharge technology—keep you on-task wherever the road leads. What\'s more, it weighs less than 1.13 kg .',21500000, 'lenovoThinkpadX1Carbon.png', 10, 1, 1);

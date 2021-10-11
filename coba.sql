SELECT tb_brand.name, tb_cart.brand_id
FROM tb_brand
INNER JOIN tb_cart
ON tb_brand.id = tb_cart.brand_id;

SELECT tb_cart.id, tb_cart.name, tb_cart.price, tb_cart.photo, tb_cart.stock, tb_brand.name AS brand, tb_category.name AS category
FROM ((tb_cart
INNER JOIN tb_brand ON tb_brand.id = tb_cart.brand_id)
INNER JOIN tb_category ON tb_category.id = tb_cart.category_id)
ORDER BY tb_cart.created_at DESC;

INSERT INTO tb_payment (qty, sub_total, transaction_id)
SELECT * FROM (SELECT 1, 12000, 18) AS tmp
WHERE NOT EXISTS (SELECT transaction_id FROM tb_payment WHERE transaction_id = 18
) LIMIT 1;

SELECT tb_transactions.sub_total, tb_product.name AS item, tb_product.photo, tb_user.email AS user FROM ((tb_transactions INNER JOIN tb_product ON tb_product.id = tb_transactions.product_id) INNER JOIN tb_user ON tb_user.id = tb_transactions.user_id) ORDER BY tb_transactions.update_at DESC;

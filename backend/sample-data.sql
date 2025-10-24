-- ============================================
-- SAMPLE DATA FOR SPORTS STORE
-- ============================================

USE sports_store;

-- ============================================
-- 1. INSERT ADMIN USER
-- ============================================
-- Password: admin123
-- Hash this password using bcrypt with salt rounds 10
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@kiwisport.vn', '$2a$10$rqYvN8EhKLqB3zqHKX5ZKuJ5pYhZWvJrN4gY5xPQvJrN4gY5xPQvJ', 'Admin Kiwi Sport', '0901234567', 'admin');

-- Sample customer (password: customer123)
INSERT INTO users (email, password_hash, full_name, phone, address, role) VALUES
('customer@example.com', '$2a$10$rqYvN8EhKLqB3zqHKX5ZKuJ5pYhZWvJrN4gY5xPQvJrN4gY5xPQvJ', 'Nguyễn Văn A', '0909876543', '123 Đường ABC, Quận 1, TP.HCM', 'customer');

-- ============================================
-- 2. INSERT CATEGORIES
-- ============================================

-- Main categories
INSERT INTO categories (name, slug, description, is_active, display_order) VALUES
('Áo Bóng Đá', 'ao-bong-da', 'Áo bóng đá các CLB, đội tuyển và áo không logo', TRUE, 1),
('Quần Bóng Đá', 'quan-bong-da', 'Quần đùi thi đấu bóng đá chất lượng cao', TRUE, 2),
('Giày Bóng Đá', 'giay-bong-da', 'Giày đá bóng chính hãng các thương hiệu nổi tiếng', TRUE, 3),
('Phụ Kiện', 'phu-kien', 'Phụ kiện bóng đá: tất, bảo hộ, găng tay thủ môn', TRUE, 4);

-- Sub-categories for Áo Bóng Đá (parent_id = 1)
INSERT INTO categories (name, slug, description, parent_id, is_active, display_order) VALUES
('Áo CLB', 'ao-clb', 'Áo các câu lạc bộ hàng đầu thế giới', 1, TRUE, 1),
('Áo Đội Tuyển', 'ao-doi-tuyen', 'Áo các đội tuyển quốc gia', 1, TRUE, 2),
('Áo Không Logo', 'ao-khong-logo', 'Áo thi đấu không logo giá rẻ', 1, TRUE, 3);

-- Sub-categories for Giày Bóng Đá (parent_id = 3)
INSERT INTO categories (name, slug, description, parent_id, is_active, display_order) VALUES
('Giày Sân Cỏ Tự Nhiên', 'giay-san-co-tu-nhien', 'Giày đá bóng sân cỏ tự nhiên', 3, TRUE, 1),
('Giày Sân Cỏ Nhân Tạo', 'giay-san-co-nhan-tao', 'Giày đá bóng sân cỏ nhân tạo', 3, TRUE, 2),
('Giày Futsal', 'giay-futsal', 'Giày đá bóng sân futsal', 3, TRUE, 3);

-- ============================================
-- 3. INSERT PRODUCTS
-- ============================================

-- Áo CLB
INSERT INTO products (category_id, name, slug, description, price, compare_price, stock_quantity, sku, status) VALUES
(5, 'Áo Bóng Đá CLB Manchester City 2024/2025 Sân Nhà', 'ao-man-city-2024-san-nha', 
'Áo đấu Manchester City màu xanh biển truyền thống, chất liệu thun co giãn 4 chiều, thoáng mát. Thiết kế hiện đại với logo thêu nổi.', 
180000, 250000, 150, 'MC-HOME-2024', 'active'),

(5, 'Áo Bóng Đá CLB Real Madrid 2024/2025 Sân Nhà', 'ao-real-madrid-2024-san-nha',
'Áo đấu Real Madrid màu trắng tinh khôi, biểu tượng của Los Blancos. Chất liệu cao cấp, thấm hút mồ hôi tốt.',
180000, 250000, 200, 'RM-HOME-2024', 'active'),

(5, 'Áo Bóng Đá CLB Barcelona 2024/2025 Sân Nhà', 'ao-barcelona-2024-san-nha',
'Áo đấu Barcelona sọc xanh đỏ truyền thống. Thiết kế đẹp mắt, phù hợp cả thi đấu và đi chơi.',
180000, 250000, 180, 'BAR-HOME-2024', 'active'),

(5, 'Áo Bóng Đá CLB Liverpool 2024/2025 Sân Nhà', 'ao-liverpool-2024-san-nha',
'Áo đấu Liverpool màu đỏ truyền thống. Chất liệu mát mẻ, co giãn tốt.',
175000, 240000, 120, 'LIV-HOME-2024', 'active'),

(5, 'Áo Bóng Đá CLB Arsenal 2024/2025 Sân Nhà', 'ao-arsenal-2024-san-nha',
'Áo đấu Arsenal màu đỏ trắng. Logo thêu sắc nét, form dáng chuẩn.',
175000, 240000, 100, 'ARS-HOME-2024', 'active');

-- Áo Đội Tuyển
INSERT INTO products (category_id, name, slug, description, price, compare_price, stock_quantity, sku, status) VALUES
(6, 'Áo Đội Tuyển Việt Nam 2024 Sân Nhà', 'ao-dt-viet-nam-2024-san-nha',
'Áo đội tuyển Việt Nam màu đỏ, biểu tượng tinh thần Rồng Vàng. Chất liệu cao cấp.',
200000, 280000, 300, 'VN-HOME-2024', 'active'),

(6, 'Áo Đội Tuyển Brazil 2024', 'ao-dt-brazil-2024',
'Áo đội tuyển Brazil màu vàng truyền thống. Thiết kế Samba đặc trưng.',
185000, 260000, 150, 'BR-HOME-2024', 'active'),

(6, 'Áo Đội Tuyển Argentina 2024', 'ao-dt-argentina-2024',
'Áo đội tuyển Argentina sọc xanh trắng. Màu sắc tươi sáng, chất lượng tốt.',
185000, 260000, 140, 'AR-HOME-2024', 'active');

-- Áo Không Logo
INSERT INTO products (category_id, name, slug, description, price, compare_price, stock_quantity, sku, status) VALUES
(7, 'Áo Bóng Đá Không Logo Màu Đỏ', 'ao-khong-logo-do',
'Áo thi đấu không logo màu đỏ. Giá rẻ, chất lượng tốt, phù hợp đội nghiệp dư.',
80000, 120000, 500, 'NL-RED-001', 'active'),

(7, 'Áo Bóng Đá Không Logo Màu Xanh', 'ao-khong-logo-xanh',
'Áo thi đấu không logo màu xanh dương. Thấm hút mồ hôi, thoáng mát.',
80000, 120000, 450, 'NL-BLUE-001', 'active'),

(7, 'Áo Bóng Đá Không Logo Màu Trắng', 'ao-khong-logo-trang',
'Áo thi đấu không logo màu trắng. Form dáng đẹp, giá cả phải chăng.',
80000, 120000, 480, 'NL-WHITE-001', 'active');

-- Quần Bóng Đá
INSERT INTO products (category_id, name, slug, description, price, compare_price, stock_quantity, sku, status) VALUES
(2, 'Quần Bóng Đá Manchester City 2024', 'quan-man-city-2024',
'Quần đùi Man City màu xanh. Vải cao cấp, co giãn 4 chiều.',
90000, 130000, 200, 'MC-SHORT-2024', 'active'),

(2, 'Quần Bóng Đá Real Madrid 2024', 'quan-real-madrid-2024',
'Quần đùi Real Madrid màu trắng. Thiết kế thể thao, thoải mái.',
90000, 130000, 180, 'RM-SHORT-2024', 'active'),

(2, 'Quần Bóng Đá Không Logo', 'quan-khong-logo',
'Quần đùi thi đấu không logo. Giá rẻ, chất lượng ổn.',
50000, 80000, 600, 'SHORT-NL-001', 'active');

-- Giày Bóng Đá
INSERT INTO products (category_id, name, slug, description, price, compare_price, stock_quantity, sku, status) VALUES
(8, 'Giày Đá Bóng Nike Mercurial Vapor', 'giay-nike-mercurial',
'Giày Nike Mercurial dành cho sân cỏ tự nhiên. Nhẹ, bám sân tốt.',
450000, 600000, 50, 'NIKE-MER-001', 'active'),

(9, 'Giày Đá Bóng Adidas X Speedflow TF', 'giay-adidas-x-tf',
'Giày Adidas X Speedflow cho sân cỏ nhân tạo. Bền, đẹp, êm chân.',
420000, 580000, 60, 'ADIDAS-X-TF', 'active'),

(10, 'Giày Futsal Mizuno Morelia IN', 'giay-mizuno-morelia',
'Giày futsal Mizuno Morelia. Da mềm, cảm giác bóng tốt.',
380000, 520000, 40, 'MIZUNO-MOR', 'active');

-- Phụ Kiện
INSERT INTO products (category_id, name, slug, description, price, compare_price, stock_quantity, sku, status) VALUES
(4, 'Tất Bóng Đá Nike', 'tat-bong-da-nike',
'Tất bóng đá Nike cao cổ. Chất liệu cotton cao cấp.',
30000, 50000, 1000, 'SOCK-NIKE-001', 'active'),

(4, 'Bảo Hộ Ống Đồng Adidas', 'bao-ho-adidas',
'Bảo hộ ống đồng Adidas. Bảo vệ tốt, êm ái.',
80000, 120000, 500, 'SHIN-ADIDAS', 'active'),

(4, 'Găng Tay Thủ Môn Adidas', 'gang-tay-adidas',
'Găng tay thủ môn Adidas Predator. Bám bóng tốt, bền.',
350000, 480000, 80, 'GLOVE-ADIDAS', 'active');

-- ============================================
-- 4. INSERT PRODUCT IMAGES
-- ============================================

-- Sample product images (you should replace with actual image URLs)
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES
-- Man City Home
(1, '/uploads/products/man-city-home-1.jpg', 'Áo Man City 2024 mặt trước', TRUE, 1),
(1, '/uploads/products/man-city-home-2.jpg', 'Áo Man City 2024 mặt sau', FALSE, 2),

-- Real Madrid Home
(2, '/uploads/products/real-madrid-home-1.jpg', 'Áo Real Madrid 2024 mặt trước', TRUE, 1),
(2, '/uploads/products/real-madrid-home-2.jpg', 'Áo Real Madrid 2024 mặt sau', FALSE, 2),

-- Barcelona Home
(3, '/uploads/products/barcelona-home-1.jpg', 'Áo Barcelona 2024 mặt trước', TRUE, 1),
(3, '/uploads/products/barcelona-home-2.jpg', 'Áo Barcelona 2024 mặt sau', FALSE, 2);

-- ============================================
-- 5. UPDATE PRODUCT STATS (Optional)
-- ============================================

UPDATE products SET view_count = FLOOR(RAND() * 1000) + 100;
UPDATE products SET sold_count = FLOOR(RAND() * 50) + 10 WHERE category_id IN (5, 6);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check data
SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Product Images', COUNT(*) FROM product_images;

-- Show products with categories
SELECT p.name, c.name as category, p.price, p.stock_quantity
FROM products p
JOIN categories c ON p.category_id = c.id
LIMIT 10;

-- ============================================
-- NOTES
-- ============================================
-- 1. Replace password hashes with actual bcrypt hashes
-- 2. Add more products as needed
-- 3. Upload actual product images to /uploads/products/
-- 4. Update image URLs in product_images table

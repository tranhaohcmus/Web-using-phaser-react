# 🏆 Sports Store Backend API

Backend API cho hệ thống bán hàng đồ thể thao, xây dựng với Node.js, Express và MySQL.

## 📋 Tính năng

- ✅ Authentication & Authorization (JWT)
- ✅ Quản lý người dùng (đăng ký, đăng nhập, profile)
- ✅ Quản lý danh mục sản phẩm (categories)
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Giỏ hàng (cart)
- ✅ Đơn hàng (orders)
- ✅ Upload hình ảnh sản phẩm
- ✅ Tìm kiếm & lọc sản phẩm
- ✅ Quên mật khẩu & reset password
- ✅ Admin panel

## 🛠️ Công nghệ sử dụng

- **Node.js** v18+
- **Express.js** v5
- **MySQL** v8
- **JWT** - JSON Web Tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Nodemailer** - Email service
- **Express Validator** - Input validation

## 📦 Cài đặt

### 1. Clone repository

```bash
cd sports-store-backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Copy file `.env.example` thành `.env` và cập nhật các giá trị:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sports_store
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Sports Store <noreply@sportsstore.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads/products
```

### 4. Tạo database

```bash
mysql -u root -p < database.sql
```

Hoặc import qua MySQL Workbench/phpMyAdmin.

### 5. Tạo thư mục uploads

```bash
mkdir -p uploads/products
```

### 6. Chạy server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Documentation

Xem file `api.md` để biết chi tiết về các API endpoints.

### Base URL

```
http://localhost:5000/api
```

### Authentication

Sử dụng Bearer Token trong header:

```
Authorization: Bearer {your_access_token}
```

### Các endpoints chính

#### Auth

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Xem profile
- `PUT /api/auth/me` - Cập nhật profile
- `POST /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu

#### Categories

- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:slug` - Xem chi tiết danh mục

#### Products

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:slug` - Xem chi tiết sản phẩm

#### Cart

- `GET /api/cart` - Xem giỏ hàng
- `POST /api/cart/items` - Thêm vào giỏ
- `PUT /api/cart/items/:id` - Cập nhật số lượng
- `DELETE /api/cart/items/:id` - Xóa khỏi giỏ
- `DELETE /api/cart` - Xóa toàn bộ giỏ hàng

#### Orders

- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Xem lịch sử đơn hàng
- `GET /api/orders/:orderNumber` - Chi tiết đơn hàng
- `POST /api/orders/:orderNumber/cancel` - Hủy đơn hàng

#### Admin - Products

- `POST /api/admin/products` - Thêm sản phẩm
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm
- `POST /api/admin/products/:id/images` - Upload ảnh
- `DELETE /api/admin/products/images/:id` - Xóa ảnh
- `PATCH /api/admin/products/:id/stock` - Cập nhật tồn kho

#### Admin - Orders

- `GET /api/admin/orders` - Danh sách đơn hàng
- `GET /api/admin/orders/:id` - Chi tiết đơn hàng
- `PATCH /api/admin/orders/:id/status` - Cập nhật trạng thái

#### Admin - Categories

- `POST /api/admin/categories` - Thêm danh mục
- `PUT /api/admin/categories/:id` - Cập nhật danh mục
- `DELETE /api/admin/categories/:id` - Xóa danh mục

## 📁 Cấu trúc thư mục

```
sports-store-backend/
├── src/
│   ├── config/           # Database, JWT, Multer config
│   ├── middleware/       # Auth, Admin, Error handling
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── utils/           # Helper functions
│   ├── validators/      # Input validation
│   └── app.js           # Express app
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── .gitignore
├── database.sql         # Database schema
├── package.json
├── server.js           # Entry point
└── README.md
```

## 🔒 Bảo mật

- ✅ Mật khẩu được hash bằng bcrypt
- ✅ JWT authentication
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection (Helmet)
- ✅ CORS configuration
- ✅ Rate limiting (nên thêm)
- ✅ File upload validation

## 🚀 Deployment

### Chuẩn bị

1. Cập nhật `.env` với giá trị production
2. Đảm bảo MySQL đã được setup
3. Import database schema
4. Cấu hình NGINX/Apache (optional)

### PM2 (Recommended)

```bash
npm install -g pm2
pm2 start server.js --name "sports-store-api"
pm2 save
pm2 startup
```

### Docker (Optional)

```bash
# Build image
docker build -t sports-store-api .

# Run container
docker run -p 5000:5000 --env-file .env sports-store-api
```

## 📝 Ghi chú

- Đảm bảo MySQL đang chạy
- Cấu hình email SMTP đúng để gửi email reset password
- Upload folder cần có quyền write
- Trong production, nên sử dụng cloud storage (AWS S3, Cloudinary) cho ảnh
- Thêm rate limiting để chống DDoS
- Setup SSL certificate cho HTTPS

## 🐛 Troubleshooting

### Lỗi kết nối database

```bash
# Kiểm tra MySQL có đang chạy không
sudo service mysql status

# Kiểm tra thông tin đăng nhập
mysql -u root -p
```

### Lỗi port đã được sử dụng

Thay đổi PORT trong file `.env`

### Lỗi upload file

Kiểm tra quyền write của thư mục uploads:

```bash
chmod -R 755 uploads/
```

## 📧 Liên hệ

- Email: support@kiwisport.vn
- Website: https://kiwisport.vn

## 📄 License

MIT License

---

**Made with ❤️ by Sports Store Team**

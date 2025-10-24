#!/bin/bash

# Script tạo cấu trúc thư mục cho Sports Store Backend
# Chạy script: bash setup-structure.sh

echo "🚀 Đang tạo cấu trúc thư mục cho Sports Store Backend..."

# Tạo thư mục src và các thư mục con
mkdir -p src/config
mkdir -p src/middleware
mkdir -p src/routes/admin
mkdir -p src/controllers/admin
mkdir -p src/models
mkdir -p src/utils
mkdir -p src/validators

# Tạo thư mục uploads
mkdir -p uploads/products

# Tạo các file config
touch src/config/database.js
touch src/config/jwt.js
touch src/config/multer.js

# Tạo các file middleware
touch src/middleware/auth.js
touch src/middleware/admin.js
touch src/middleware/validate.js
touch src/middleware/errorHandler.js
touch src/middleware/upload.js

# Tạo các file routes
touch src/routes/auth.routes.js
touch src/routes/categories.routes.js
touch src/routes/products.routes.js
touch src/routes/cart.routes.js
touch src/routes/orders.routes.js
touch src/routes/admin/products.routes.js
touch src/routes/admin/orders.routes.js
touch src/routes/admin/categories.routes.js

# Tạo các file controllers
touch src/controllers/auth.controller.js
touch src/controllers/categories.controller.js
touch src/controllers/products.controller.js
touch src/controllers/cart.controller.js
touch src/controllers/orders.controller.js
touch src/controllers/admin/products.controller.js
touch src/controllers/admin/orders.controller.js
touch src/controllers/admin/categories.controller.js

# Tạo các file models
touch src/models/user.model.js
touch src/models/product.model.js
touch src/models/category.model.js
touch src/models/cart.model.js
touch src/models/order.model.js

# Tạo các file utils
touch src/utils/jwt.util.js
touch src/utils/email.util.js
touch src/utils/password.util.js
touch src/utils/slugify.util.js

# Tạo các file validators
touch src/validators/auth.validator.js
touch src/validators/product.validator.js
touch src/validators/cart.validator.js
touch src/validators/order.validator.js

# Tạo file app.js
touch src/app.js

# Tạo file server.js
touch server.js

# Tạo file .gitignore nếu chưa có
if [ ! -f .gitignore ]; then
    touch .gitignore
fi

echo "✅ Đã tạo xong cấu trúc thư mục!"
echo ""
echo "📁 Cấu trúc đã được tạo:"
echo "   - src/config/"
echo "   - src/middleware/"
echo "   - src/routes/ (bao gồm admin/)"
echo "   - src/controllers/ (bao gồm admin/)"
echo "   - src/models/"
echo "   - src/utils/"
echo "   - src/validators/"
echo "   - uploads/products/"
echo ""
echo "🎯 Các bước tiếp theo:"
echo "   1. Cài đặt dependencies: npm install"
echo "   2. Cấu hình file .env"
echo "   3. Tạo database MySQL"
echo "   4. Bắt đầu code các file"
echo ""
echo "✨ Chúc bạn code vui vẻ!"

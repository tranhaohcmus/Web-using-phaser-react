require("dotenv").config();
const app = require("./src/app");
const { testConnection } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

// Test database connection
testConnection();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

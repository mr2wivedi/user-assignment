const app = require("./app");
const connectWithDb = require("./config/db");
require("dotenv").config();

// connect with databases
connectWithDb();
try {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
    
} catch (error) {
    console.log(error)
}
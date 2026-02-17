// in Node REPL or script (dev-only)
const mongoose = require("mongoose");
const User = require("./models/User");
(async ()=>{
  await mongoose.connect(process.env.MONGO_URI);
  const bcrypt = require("bcryptjs");
  const hashed = await bcrypt.hash("adminpass",10);
  await User.create({ name:"Admin", email:"admin@cctv.com", password: hashed, role: "admin" });
  console.log("admin created");
  process.exit();
})();

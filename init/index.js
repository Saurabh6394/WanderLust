require("dotenv").config({ path: "../.env" });
 // ✅ VERY IMPORTANT

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing");

const dbUrl = process.env.ATLASDB_URL; // ✅ now defined
const OWNER_ID = "69726076d83726db1389986c"; // your user ID

async function main() {
  if (!dbUrl) {
    console.error("❌ ATLASDB_URL is undefined");
    process.exit(1);
  }

  await mongoose.connect(dbUrl);
  console.log("Connected to DB:", mongoose.connection.name);

  await Listing.deleteMany({});

  const listings = initData.data.map((obj) => ({
    ...obj,
    owner: OWNER_ID,
  }));

  await Listing.insertMany(listings);
  console.log("✅ Listings inserted successfully");

  mongoose.connection.close();
}

main().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});

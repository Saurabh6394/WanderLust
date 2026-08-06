require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const User = require("../models/user");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    if (!dbUrl) {
        console.error("❌ ATLASDB_URL is undefined");
        process.exit(1);
    }

    await mongoose.connect(dbUrl);

    console.log(
        "Connected to DB:",
        mongoose.connection.name
    );

    // Find existing seed user
    let user = await User.findOne({
        username: "wanderlust_admin"
    });

    // Create user if it doesn't exist
    if (!user) {
        user = new User({
            email: "admin@wanderlust.com",
            username: "wanderlust_admin"
        });

        await User.register(user, "TemporaryPassword123!");

        console.log("✅ Seed user created");
    }

    // Remove existing listings
    await Listing.deleteMany({});

    const listings = initData.data.map((obj) => ({
        ...obj,
        owner: user._id
    }));

    await Listing.insertMany(listings);

    console.log(
        `✅ ${listings.length} listings inserted successfully`
    );

    mongoose.connection.close();
}

main().catch((err) => {
    console.error(err);
    mongoose.connection.close();
});
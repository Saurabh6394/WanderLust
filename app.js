if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy
const User = require('./models/user');

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL


main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const store = new MongoStore({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
}

app.use(session(sessionOptions));
app.use(flash());

//IMPLEMENTING PASSPORT //
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

//USING SERIALIZEUSER & DESERIALIZEUSER //
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.query = req.query || {};
    res.locals.currentUser = req.user; //-- BY THIS WE ACCESS OUR CURRENT USER LOGGED IN OR NOT //
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next()
});


mongoose.connection.on("connected", () => {
    console.log("Connected to DB:", mongoose.connection.name);
});


app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

// RANDOM ROUTE RESPONSE //
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

//ERROR HANDELING MIDDLEWARE //
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).render("error", { message });
});

app.listen(8080, () => {
    console.log("server is listening to 8080")
});



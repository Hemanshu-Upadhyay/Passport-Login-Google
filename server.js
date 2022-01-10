const express = require('express')
require('dotenv').config()
const app = express()
const Port = process.env.PORT || 3000
const session = require('express-session');
const passport = require('passport')
let userprofile;
const googleStrategy = require('passport-google-oauth20').Strategy


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    }))

passport.serializeUser((user, done) => {
    done(null, user)
})


app.get('/',(req,res)=>{
   res.render('Login')
})

app.get('/profile',(req,res) =>{
    res.send(userprofile)
})

passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `http://localhost:3000/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    userprofile = profile;
    done(null, profile)
}))

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}))

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.listen(Port,(req,res)=>{
    console.log(`Server Running on Port ${Port}`)
})
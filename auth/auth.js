import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import { Mongo } from '../src/database/mongo.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { buffer } from 'stream/consumers';

const collectionName = 'users';

passport.use(new LocalStrategy.Strategy({ usernameField: 'email' }, async (email, password, callback) => {
    const user = await Mongo.db
        .collection(collectionName)
        .findOne({ email: email })

    if (!user) {
        return callback(null, false )
    }

const saltBuffer = user.salt.buffer

crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassord) => {
    if (err) {
        return callback(err, false)
    }
    const userPasswordBuffer = Buffer.from(user.password.buffer)
    
    if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassord)) {
        return callback(null, false)
    }

    const { password, salt, ...reset } = user

    return callback(null, reset)
    })

    
}))

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    const checkUser = await Mongo.db
    .collection(collectionName)
    .findOne({ email: req.body.email })

    if (checkUser) {
        return res.status(500).send({ 
            sucess: false,
            statusCode:500,
            body: {
                text: 'User already exists'
            } 
        })
    }

    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({ 
                sucess: false,
                statusCode:500,
                body: {
                    text: 'Error on crypto password!',
                    err: err
                } 
            })

        }

        const result = await Mongo.db
        .collection(collectionName)
        .insertOne({
            email: req.body.email,
            password: hashedPassword,
            salt
        })
        if(result.insertedId){
            const user = await Mongo.db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(result.insertedId) })
        
            const token = jwt.sign(user, 'secret')
                return res.send({ 
                    sucess: true,
                    statusCode:200,
                    body: {
                        text: 'User registred successfully',
                        token,
                        user,
                        logged: true
                    }
            })
        }
    })
})

authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if(error){
            return res.status(500).send({
                sucess: false,
            statusCode:500,
            body: {
                text: 'Error during authentication',
                error
                }
            })
        }
        if(!user) {
            return res.status(400).send({
                sucess: false,
                statusCode:400,
                body: {
                    text: 'User not found'
                }
            })
        }

        const token = jwt.sign(user, 'secret')
        return res.send({
            sucess: true,
            statusCode:200,
            body: {
                text: 'User logged in successfully',
                token,
                user,
        
            }
        })

    })(req, res)
})

export default authRouter
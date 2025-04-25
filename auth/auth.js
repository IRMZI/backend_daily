import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import { Mongo } from '../database/mongo.js';
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

const saltBuffer = user.salt.saltBuffer

crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassord) => {
    if (err) {
        return callback(err, false)
    }
    const userPasswordBuffer = Buffer.from(user.password.buffer)
    
    if(!crypto.timingSafeEqual(usedPassordBuffer, hashedPassord)) {
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


        }

        const result = await Mongo.db
        .collection(collectionName)
        .insertOne({
            email: req.body.email,
            password: req.body.hashedPassord,
            salt
        })

        if(result.insertId {
            const user = await Mongo.db
            .collection(collectionName)
            .findOne({ _id: ObjectId(result.insertedId) })
        
            const token = jwt.sign(user, 'secret')
                return res.send({ 
                    sucess: false,
                    statusCode:500,
                    body: {
                        text: 'User already exists'
                    }
            })
        }
        }
    })
})
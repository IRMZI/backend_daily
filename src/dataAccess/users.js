import { Mongo } from '../database/mongo.js'
import { ObjectId } from 'mongodb' 
import crypto from 'crypto'

const collectionName = 'users'

export default class UsersDataAccess {
    async getUsers () {
        const result = await Mongo.db
        .collection(collectionName)
        .find({ })
        .toArray()

        return result
    }

    async deleteUser (userId) {
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(userId) })
        

        return result
    }

    async updateUser(userId, userData) {
        if(userData.password) {
            // Using Promise to handle the async crypto callback properly
            return new Promise((resolve, reject) => {
                const salt = crypto.randomBytes(16);
                
                crypto.pbkdf2(userData.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
                    if (err) {
                        reject(new Error('Error during hashing password'));
                        return;
                    }
                    
                    try {
                        const updateData = {
                            ...userData,
                            password: hashedPassword,
                            salt: salt
                        };
                        
                        const result = await Mongo.db
                            .collection(collectionName)
                            .findOneAndUpdate(
                                { _id: new ObjectId(userId) }, 
                                { $set: updateData },
                                { returnDocument: 'after' }
                            );
                        
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        } else {
            try {
                const result = await Mongo.db
                    .collection(collectionName)
                    .findOneAndUpdate(
                        { _id: new ObjectId(userId) }, 
                        { $set: userData },
                        { returnDocument: 'after' }
                    );
                
                return result;
            } catch (error) {
                throw error;
            }
        }
    }
}
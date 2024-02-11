
// const {MongoClient, ObjectId} = require("mongodb");
// console.log(process.env.secret_key)
// const url  = process.env.MONGODB_URI;

// //const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


// const dbName = process.env.DB_NAME;

// console.log(url);
// // async function createDBCollection() {
// //   try {
// //     // Connect to the MongoDB server
// //     console.log("nothing")
// //     await client.connect();
// // console.log("hi");
// //     // Create a new database
// //     const db = client.db(dbName);
// //     console.log("Connected to the database");

// //     // Create a new collection
// //     await db.createCollection('user-name');
// //     await db.createCollection('newsFeed');
// //     console.log("Collections created");

// //   } catch (err) {
// //     console.log(err.stack);
// //   }
// // }

// async function check(username,password){
//     try {
//         console.log("ji0");
//         const client =await new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log(client);
//         const db = await client.db('24x7');
//         console.log(db)
//         const collection =await db.collection('user-name');
//         console.log(collection);
//         console.log(username,password);
//         username="hsingal200@gmail.com";
//         password="123"
//         let value = await collection.findOne({"username":username});
        
//         console.log(value);
//         if(value != undefined && value.password === password)return true;
//         else return false;
//     } catch (error) {
//         console.log(error);
        
//     }
// }
// async function add(obj){
//     try {
//         const db = await client.db('24x7');
//         const collection =await db.collection('newsFeed');

        
//         await collection.insertOne(obj)
       
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function allData(){

//     try {

//         const db = await client.db('24x7');
//         const collection =await db.collection('newsFeed');

//         const data = await collection.find({}).toArray()
        
//       //  console.log(data);
//        return data;
//     } catch (error) {
//         console.log(error);
        
//     }
    
// }

// async function latestNews(){
//     try{
//         const db =await client.db('24x7');
//         const collection = await db.collection('newsFeed');
//         const data = await collection.find({}).sort({"published":-1}).limit(3).toArray();
//         console.log(data);
//         return data;

//     }
//     catch(err){
//         console.log(error);
//         return null;
//     }
// }
// async function latestSportsNews(){
//     try{
//         const db =await client.db('24x7');
//         const collection = await db.collection('newsFeed');
//         const data = await collection.find({"sports":"on"}).sort({"published":-1}).limit(3).toArray();
//         console.log(data);
//         return data;

//     }
//     catch(err){
//         console.log(error);
//         return null;
//     }
// }
// async function deleteOne(id){
//     try{
//         const db =await client.db('24x7');
//         const collection = await db.collection('newsFeed');
//         const data = await collection.findOne({"_id":new ObjectId(id)});
//         console.log(data);
//         await collection.deleteOne({"_id":new ObjectId(id)})
        
       

//     }
//     catch(err){
//         console.log(err);
       
//     }

// }

// async function newUser(email,password){
//     await createDBCollection();
//     try{
      
//         const db =await client.db('24x7');
//         const collection = await db.collection('user-name');
//         const user = await collection.findOne({"username":email});
//         if(user){
//             return null;
//         }
//         console.log("hiii");
//         await collection.insertOne({"username":email,"password":password});
//         return 1;


        
       

//     }
//     catch(err){
//         console.log(err);
       
//     }

// }
// module.exports = { allData, add, check, latestNews,deleteOne ,newUser,latestSportsNews};

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Define Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const newsFeedSchema = new mongoose.Schema({
    title:String,
    Discription:String,
    url:String,
    urlToImage:String,
    published:String,
    sports:String
});

// Define Models
const UserModel = mongoose.model('User', userSchema);
const NewsFeedModel = mongoose.model('NewsFeed', newsFeedSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Functions
async function check(username, password) {
    try {
        const user = await UserModel.findOne({ username });
        return user && user.password === password;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function add(obj) {
    try {
        await NewsFeedModel.create(obj);
    } catch (error) {
        console.error(error);
    }
}

async function allData() {
    try {
        return await NewsFeedModel.find({});
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function latestNews() {
    try {
        return await NewsFeedModel.find({}).sort({ published: -1 }).limit(3);
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function latestSportsNews() {
    try {
        return await NewsFeedModel.find({ sports: "on" }).sort({ published: -1 }).limit(3);
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteOne(id) {
    try {
        await NewsFeedModel.findByIdAndDelete(id);
    } catch (error) {
        console.error(error);
    }
}

async function newUser(email, password) {
    try {
        const existingUser = await UserModel.findOne({ username: email });
        if (existingUser) {
            return null;
        }
        await UserModel.create({ username: email, password });
        return 1;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { allData, add, check, latestNews, deleteOne, newUser, latestSportsNews };

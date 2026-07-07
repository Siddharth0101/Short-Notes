'use strict';

/**
 * ========================================================================
 * MONGODB AND MONGOOSE BASICS - SHORT NOTES
 * ========================================================================
 * NOTES:
 * - MongoDB NoSQL document database hai.
 * - Mongoose Node.js ke liye ODM hai: schemas, models, validation, middleware.
 */


/**
 * ========================================================================
 * 1. MONGODB BASICS
 * ========================================================================
 * NOTES:
 * - Database -> collections -> documents.
 * - Document JSON-like BSON format me store hota hai.
 * - BSON document ka maximum size 16 MB hota hai.
 * - Agar size 16 MB se zyada bada ho, toh hum GridFS use kar sakte hain:
 *   - GridFS file ko chunks me break/split/divide karta hai (typically 255 KB each).
 *   - Chunks ko multiple documents ke across store karta hai.
 *   - File retrieve karte time automatically unhe reassemble karta hai.
 * - Schema flexible hoti hai, but Mongoose se structure enforce karte hain.
 *
 * SQL vs MONGO:
 * - Table      -> Collection
 * - Row        -> Document
 * - Column     -> Field
 * - Join       -> Embed or reference + populate
 */


/**
 * ========================================================================
 * 2. DOCUMENT EXAMPLE
 * ========================================================================
 */

const tourDocument = {
    name: 'The Forest Hiker',
    duration: 5,
    maxGroupSize: 25,
    difficulty: 'easy',
    ratingsAverage: 4.7,
    price: 397
};

console.log(tourDocument.name);


/**
 * ========================================================================
 * 3. MONGODB CRUD COMMANDS
 * ========================================================================
 * NOTES:
 * - Shell/Compass me basic commands useful hain.
 */

// use natours
// db.tours.insertOne({ name: 'The Forest Hiker', price: 397 })
// db.tours.insertMany([{ name: 'Tour 1' }, { name: 'Tour 2' }])
// db.tours.find()
// db.tours.find({ price: { $lte: 500 } })
// db.tours.updateOne({ name: 'Tour 1' }, { $set: { price: 499 } })
// db.tours.deleteOne({ name: 'Tour 2' })


/**
 * ========================================================================
 * 4. ATLAS AND COMPASS
 * ========================================================================
 * NOTES:
 * - Atlas hosted MongoDB database hai.
 * - Compass GUI hai.
 * - Atlas connection me:
 *   1. database user.
 *   2. IP whitelist.
 *   3. connection string.
 *   4. password replace.
 */


/**
 * ========================================================================
 * 5. CONNECT EXPRESS APP TO MONGODB
 * ========================================================================
 * NOTES:
 * - mongoose.connect promise return karta hai.
 * - DB connection server start se pehle setup karna common hai.
 */

// const mongoose = require('mongoose');
//
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//
// mongoose
//     .connect(DB)
//     .then(() => console.log('DB connection successful'));


/**
 * ========================================================================
 * 6. MONGOOSE SCHEMA
 * ========================================================================
 * NOTES:
 * - Schema document ka shape define karta hai.
 * - Type, required, default, unique, validators etc. define hote hain.
 */

// const tourSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'A tour must have a name'],
//         unique: true,
//         trim: true
//     },
//     duration: {
//         type: Number,
//         required: [true, 'A tour must have a duration']
//     },
//     price: {
//         type: Number,
//         required: [true, 'A tour must have a price']
//     },
//     ratingsAverage: {
//         type: Number,
//         default: 4.5
//     }
// });


/**
 * ========================================================================
 * 7. MODEL
 * ========================================================================
 * NOTES:
 * - Model schema se banne wali class hai.
 * - Model ke through documents create/read/update/delete karte hain.
 */

// const Tour = mongoose.model('Tour', tourSchema);
// const testTour = new Tour({ name: 'The Park Camper', price: 997 });
// await testTour.save();


/**
 * ========================================================================
 * 8. CRUD WITH MONGOOSE
 * ========================================================================
 */

// CREATE
// const tour = await Tour.create(req.body);
//
// READ ALL
// const tours = await Tour.find();
//
// READ ONE
// const tour = await Tour.findById(req.params.id);
//
// UPDATE
// const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
// });
//
// DELETE
// await Tour.findByIdAndDelete(req.params.id);


/**
 * ========================================================================
 * 9. MVC WITH MONGOOSE [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Application Architecture Express app mein: Request -> Router -> Controller -> Model/View
 * - ROUTER (Application Logic): Client se request receive karta hai aur specific route ke liye controller mapping karta hai. (e.g. tourRouter.js, userRouter.js)
 * - CONTROLLER (Application Logic): Application ka brain. Request receive karke business logic (Model) call karta hai aur presentation logic (View) ko data send karta hai. (e.g. tourController.js)
 * - MODEL (Business Logic): Database related saari logic, mongoose schemas, aur business rules yahan hoti hain. Controller model ke through database se data leta hai.
 * - VIEW (Presentation Logic): User ko data dikhane ki logic (React, Pug templates, JSON response etc).
 */


/**
 * ========================================================================
 * 10. IMPORTING DEVELOPMENT DATA
 * ========================================================================
 * NOTES:
 * - Separate script seed data import/delete ke liye.
 * - process.argv command line args read karta hai.
 * - Script ke end me process.exit() use hota hai after DB op.
 */

// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete


/**
 * ========================================================================
 * 11. API FILTERING
 * ========================================================================
 * NOTES:
 * - req.query contains filters and special fields.
 * - Reserved fields remove karo: page, sort, limit, fields.
 */

// const queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(el => delete queryObj[el]);
// const tours = await Tour.find(queryObj);


/**
 * ========================================================================
 * 12. ADVANCED FILTERING
 * ========================================================================
 * NOTES:
 * - URL: ?price[gte]=500&ratingsAverage[lt]=4.8
 * - Mongo operator: { price: { $gte: 500 } }
 */

// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
// const query = Tour.find(JSON.parse(queryStr));


/**
 * ========================================================================
 * 13. SORTING
 * ========================================================================
 * NOTES:
 * - ?sort=price,-ratingsAverage
 * - Mongoose sort string: 'price -ratingsAverage'
 */

// if (req.query.sort) {
//     const sortBy = req.query.sort.split(',').join(' ');
//     query = query.sort(sortBy);
// } else {
//     query = query.sort('-createdAt');
// }


/**
 * ========================================================================
 * 14. FIELD LIMITING
 * ========================================================================
 * NOTES:
 * - ?fields=name,duration,price
 * - select('name duration price')
 * - Schema me select: false sensitive fields hide kar sakta hai.
 */

// if (req.query.fields) {
//     const fields = req.query.fields.split(',').join(' ');
//     query = query.select(fields);
// } else {
//     query = query.select('-__v');
// }


/**
 * ========================================================================
 * 15. PAGINATION
 * ========================================================================
 * NOTES:
 * - ?page=2&limit=10
 * - skip = (page - 1) * limit
 */

// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);


/**
 * ========================================================================
 * 16. API FEATURES CLASS
 * ========================================================================
 * NOTES:
 * - Filtering/sorting/fields/pagination ko reusable class me daalo.
 * - Controller clean ho jata hai.
 */

class APIFeaturesExample {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        return this;
    }
}

console.log(typeof APIFeaturesExample);


/**
 * ========================================================================
 * 17. AGGREGATION PIPELINE
 * ========================================================================
 * NOTES:
 * - MongoDB data transform/analyze karne ka powerful system.
 * - Stages array order me run hote hain.
 */

// const stats = await Tour.aggregate([
//     { $match: { ratingsAverage: { $gte: 4.5 } } },
//     {
//         $group: {
//             _id: '$difficulty',
//             numTours: { $sum: 1 },
//             avgRating: { $avg: '$ratingsAverage' },
//             avgPrice: { $avg: '$price' },
//             minPrice: { $min: '$price' },
//             maxPrice: { $max: '$price' }
//         }
//     },
//     { $sort: { avgPrice: 1 } }
// ]);


/**
 * ========================================================================
 * 18. UNWIND AND PROJECT
 * ========================================================================
 * NOTES:
 * - $unwind array ke har element ko separate document banata hai.
 * - $project output fields shape karta hai.
 */

// const plan = await Tour.aggregate([
//     { $unwind: '$startDates' },
//     { $match: { startDates: { $gte: new Date('2027-01-01'), $lte: new Date('2027-12-31') } } },
//     { $group: { _id: { $month: '$startDates' }, numTourStarts: { $sum: 1 }, tours: { $push: '$name' } } },
//     { $addFields: { month: '$_id' } },
//     { $project: { _id: 0 } },
//     { $sort: { numTourStarts: -1 } }
// ]);


/**
 * ========================================================================
 * 19. VIRTUAL PROPERTIES
 * ========================================================================
 * NOTES:
 * - Virtual calculated field hai, DB me save nahi hota.
 * - Query nahi kar sakte because stored field nahi hai.
 */

// tourSchema.virtual('durationWeeks').get(function () {
//     return this.duration / 7;
// });


/**
 * ========================================================================
 * 20. MONGOOSE MIDDLEWARE
 * ========================================================================
 * DOCUMENT MIDDLEWARE:
 * - save/create pe run.
 * - this = document.
 *
 * QUERY MIDDLEWARE:
 * - find/update queries pe run.
 * - this = query.
 *
 * AGGREGATION MIDDLEWARE:
 * - aggregate pe run.
 * - this.pipeline() access.
 */

// tourSchema.pre('save', function (next) {
//     this.slug = this.name.toLowerCase().split(' ').join('-');
//     next();
// });
//
// tourSchema.pre(/^find/, function (next) {
//     this.find({ secretTour: { $ne: true } });
//     next();
// });
//
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     next();
// });


/**
 * ========================================================================
 * 21. VALIDATION
 * ========================================================================
 * BUILT-IN:
 * - required, min, max, minlength, maxlength, enum.
 *
 * CUSTOM:
 * - validator function true/false return karta hai.
 */

// priceDiscount: {
//     type: Number,
//     validate: {
//         validator: function (val) {
//             return val < this.price;
//         },
//         message: 'Discount price should be below regular price'
//     }
// }

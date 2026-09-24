/**
 * ## Quick revision
 *
 * - Document — BSON fields ka record; collection related documents rakhti hai.
 * - CRUD — insert, find, update, delete.
 * - Filter — precise conditions; untrusted query objects directly accept mat karo.
 * - `$set` — selected fields update; full replacement alag operation.
 * - Embed — saath read/update hone wala bounded data.
 * - Reference — shared, independently changing ya unbounded relation.
 * - Atomicity — single-document write atomic; multiple documents ke liye boundary plan karo.
 * - Schema design — query/access pattern se start karo.
 * - Mongoose schema — type/default/validation layer; model collection API deta hai.
 * - ObjectId — identifier; timestamp ko authorization proof mat samjho.
 * - Lean — plain results; document methods/change tracking skip.
 * - `$inc` — atomic numeric increment; application read-then-write race se bacho.
 * - Projection — needed fields hi return; network payload aur sensitive-field exposure kam.
 * - `$elemMatch` — array ke ek hi element ko saari supplied conditions satisfy karni hoti hain.
 */

'use strict';


const tourDocument = {
    name: 'The Forest Hiker',
    duration: 5,
    maxGroupSize: 25,
    difficulty: 'easy',
    ratingsAverage: 4.7,
    price: 397
};

console.log(tourDocument.name);


// use natours
// db.tours.insertOne({ name: 'The Forest Hiker', price: 397 })
// db.tours.insertMany([{ name: 'Tour 1' }, { name: 'Tour 2' }])
// db.tours.find()
// db.tours.find({ price: { $lte: 500 } })
// db.tours.updateOne({ name: 'Tour 1' }, { $set: { price: 499 } })
// db.tours.deleteOne({ name: 'Tour 2' })


// const mongoose = require('mongoose');
//
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//
// mongoose
//     .connect(DB)
//     .then(() => console.log('DB connection successful'));


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


// const Tour = mongoose.model('Tour', tourSchema);
// const testTour = new Tour({ name: 'The Park Camper', price: 997 });
// await testTour.save();


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


// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete


// const queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(el => delete queryObj[el]);
// const tours = await Tour.find(queryObj);


// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
// const query = Tour.find(JSON.parse(queryStr));


// if (req.query.sort) {
//     const sortBy = req.query.sort.split(',').join(' ');
//     query = query.sort(sortBy);
// } else {
//     query = query.sort('-createdAt');
// }


// if (req.query.fields) {
//     const fields = req.query.fields.split(',').join(' ');
//     query = query.select(fields);
// } else {
//     query = query.select('-__v');
// }


// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);


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


// const plan = await Tour.aggregate([
//     { $unwind: '$startDates' },
//     { $match: { startDates: { $gte: new Date('2027-01-01'), $lte: new Date('2027-12-31') } } },
//     { $group: { _id: { $month: '$startDates' }, numTourStarts: { $sum: 1 }, tours: { $push: '$name' } } },
//     { $addFields: { month: '$_id' } },
//     { $project: { _id: 0 } },
//     { $sort: { numTourStarts: -1 } }
// ]);


// tourSchema.virtual('durationWeeks').get(function () {
//     return this.duration / 7;
// });


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


// priceDiscount: {
//     type: Number,
//     validate: {
//         validator: function (val) {
//             return val < this.price;
//         },
//         message: 'Discount price should be below regular price'
//     }
// }

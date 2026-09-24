/**
 * ## Quick revision
 *
 * - Mongoose — MongoDB ke liye schema/model layer.
 * - Schema — field types, defaults, validators aur hooks.
 * - Model — collection ke documents query/create karne ka API.
 * - Validation — client input ke saath persistence rules bhi check karo.
 * - `unique` — unique index declaration; normal validator nahi.
 * - Update validators — update methods mein options/limitations check karo.
 * - Populate — references resolve; joins jaisa cost/query volume evaluate karo.
 * - `lean()` — plain objects; document methods/change tracking nahi.
 * - Hook — save aur query middleware ka behavior same assume mat karo.
 * - Document/query hooks — save aur updateOne ke hooks/context ko interchangeable mat samjho.
 * - Virtual field — computed representation; persisted field/index automatic nahi banta.
 * - Version check — stale read se overwrite avoid karne ke liye optimistic concurrency ka explicit contract.
 */

'use strict';


const embeddedExample = {
    name: 'The Forest Hiker',
    startLocation: {
        type: 'Point',
        coordinates: [-80.185942, 25.774772],
        description: 'Miami, USA'
    },
    locations: [
        { type: 'Point', coordinates: [-80.128473, 25.781842], day: 1 }
    ]
};

const referencedExample = {
    tour: '5c88fa8cf4afda39709c2955',
    user: '5c8a1dfa2f8fb814b56fa181',
    review: 'Amazing tour',
    rating: 5
};

console.log(embeddedExample.name, referencedExample.rating);


// guides: [
//     {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//     }
// ]
//
// const tour = await Tour.findById(id).populate('guides');


// const reviewSchema = new mongoose.Schema({
//     review: {
//         type: String,
//         required: [true, 'Review can not be empty']
//     },
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5
//     },
//     tour: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Tour',
//         required: [true, 'Review must belong to a tour']
//     },
//     user: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: [true, 'Review must belong to a user']
//     }
// });


// const reviews = await Review.find().populate({
//     path: 'tour',
//     select: 'name'
// }).populate({
//     path: 'user',
//     select: 'name photo'
// });


// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     });
//     next();
// });


// tourSchema.virtual('reviews', {
//     ref: 'Review',
//     foreignField: 'tour',
//     localField: '_id'
// });
//
// const tour = await Tour.findById(id).populate('reviews');


// const router = express.Router({ mergeParams: true });
//
// router
//     .route('/')
//     .get(getAllReviews)
//     .post(protect, restrictTo('user'), setTourUserIds, createReview);


// exports.deleteOne = Model => catchAsync(async (req, res, next) => {
//     const doc = await Model.findByIdAndDelete(req.params.id);
//     if (!doc) return next(new AppError('No document found with that ID', 404));
//     res.status(204).json({ status: 'success', data: null });
// });


// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // one review per user per tour


// reviewSchema.statics.calcAverageRatings = async function (tourId) {
//     const stats = await this.aggregate([
//         { $match: { tour: tourId } },
//         { $group: { _id: '$tour', nRating: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
//     ]);
//     await Tour.findByIdAndUpdate(tourId, {
//         ratingsQuantity: stats[0]?.nRating || 0,
//         ratingsAverage: stats[0]?.avgRating || 4.5
//     });
// };


// startLocation: {
//     type: {
//         type: String,
//         default: 'Point',
//         enum: ['Point']
//     },
//     coordinates: [Number],
//     address: String,
//     description: String
// }
//
// tourSchema.index({ startLocation: '2dsphere' });


// const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
// const tours = await Tour.find({
//     startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
// });


// const distances = await Tour.aggregate([
//     {
//         $geoNear: {
//             near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
//             distanceField: 'distance',
//             distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001
//         }
//     },
//     { $project: { distance: 1, name: 1 } }
// ]);

'use strict';

/**
 * ========================================================================
 * DATA MODELING AND ADVANCED MONGOOSE - SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - NoSQL me data model app queries ke according design hota hai.
 * - Perfect normalization nahi; performance and access pattern important hai.
 */


/**
 * ========================================================================
 * 1. DATA MODELING QUESTIONS
 * ========================================================================
 * ASK:
 * - App ka data kaise related hai?
 * - Data kitni baar read/write hota hai?
 * - Data together query hota hai ya separately?
 * - Relationship one-to-one, one-to-many, many-to-many?
 * - Data size grow karega kya?
 */


/**
 * ========================================================================
 * 2. EMBEDDING VS REFERENCING
 * ========================================================================
 * EMBEDDING:
 * - Related data same document me.
 * - Fast reads.
 * - Good for one-to-few / tightly coupled data.
 * - Bad if embedded array unbounded grow kare.
 *
 * REFERENCING:
 * - Store ObjectId reference to another collection.
 * - Better for large/many relationships.
 * - Needs populate or separate query.
 */

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


/**
 * ========================================================================
 * 3. TYPES OF RELATIONSHIPS
 * ========================================================================
 * 1:1       -> embed usually.
 * 1:few     -> embed usually.
 * 1:many    -> reference usually.
 * 1:ton     -> child references parent, avoid huge parent arrays.
 * many:many -> references both sides or join-like collection.
 */


/**
 * ========================================================================
 * 4. REFERENCING USERS/GUIDES IN TOUR
 * ========================================================================
 * NOTES:
 * - guides field array of ObjectId refs to User.
 * - populate converts ids into full documents.
 */

// guides: [
//     {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//     }
// ]
//
// const tour = await Tour.findById(id).populate('guides');


/**
 * ========================================================================
 * 5. CHILD REFERENCING: REVIEWS
 * ========================================================================
 * NOTES:
 * - Review belongs to tour and user.
 * - Store tour/user ids in Review document.
 * - Avoid huge reviews array inside Tour.
 */

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


/**
 * ========================================================================
 * 6. POPULATE
 * ========================================================================
 * NOTES:
 * - populate foreign referenced docs fetch karta hai.
 * - select se fields limit karo.
 * - Too much populate performance slow kar sakta hai.
 */

// const reviews = await Review.find().populate({
//     path: 'tour',
//     select: 'name'
// }).populate({
//     path: 'user',
//     select: 'name photo'
// });


/**
 * ========================================================================
 * 7. QUERY MIDDLEWARE AUTO-POPULATE
 * ========================================================================
 * NOTES:
 * - Repeated populate ko pre(/^find/) middleware me rakh sakte ho.
 * - Be careful: hidden performance cost.
 */

// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     });
//     next();
// });


/**
 * ========================================================================
 * 8. VIRTUAL POPULATE
 * ========================================================================
 * NOTES:
 * - Parent document me child refs store nahi karna.
 * - Virtual populate relationship define karta hai.
 * - Example: Tour -> Reviews, but reviews store tour id.
 */

// tourSchema.virtual('reviews', {
//     ref: 'Review',
//     foreignField: 'tour',
//     localField: '_id'
// });
//
// const tour = await Tour.findById(id).populate('reviews');


/**
 * ========================================================================
 * 9. NESTED ROUTES
 * ========================================================================
 * NOTES:
 * - /tours/:tourId/reviews -> create/list reviews for one tour.
 * - mergeParams true child router ko parent params deta hai.
 */

// const router = express.Router({ mergeParams: true });
//
// router
//     .route('/')
//     .get(getAllReviews)
//     .post(protect, restrictTo('user'), setTourUserIds, createReview);


/**
 * ========================================================================
 * 10. FACTORY HANDLERS
 * ========================================================================
 * NOTES:
 * - Similar CRUD controllers repeat hote hain.
 * - handlerFactory reusable deleteOne/updateOne/createOne/getOne/getAll banata hai.
 */

// exports.deleteOne = Model => catchAsync(async (req, res, next) => {
//     const doc = await Model.findByIdAndDelete(req.params.id);
//     if (!doc) return next(new AppError('No document found with that ID', 404));
//     res.status(204).json({ status: 'success', data: null });
// });


/**
 * ========================================================================
 * 11. INDEXES
 * ========================================================================
 * NOTES:
 * - Index query speed badhata hai.
 * - But write operations thode slower because index update hota hai.
 * - Frequently filtered/sorted fields index karo.
 */

// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // one review per user per tour


/**
 * ========================================================================
 * 12. CALCULATING AVERAGE RATINGS
 * ========================================================================
 * NOTES:
 * - Review create/update/delete ke baad tour ratings update karo.
 * - Static method model-level helper ke liye.
 */

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


/**
 * ========================================================================
 * 13. GEOSPATIAL DATA
 * ========================================================================
 * NOTES:
 * - GeoJSON Point format use hota hai.
 * - Coordinates order: [longitude, latitude].
 * - 2dsphere index geospatial queries ke liye required.
 */

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


/**
 * ========================================================================
 * 14. GEOSPATIAL QUERIES
 * ========================================================================
 * NOTES:
 * - $geoWithin finds docs inside a sphere.
 * - distance unit conversion needed: miles/radians or km/radians.
 */

// const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
// const tours = await Tour.find({
//     startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
// });


/**
 * ========================================================================
 * 15. AGGREGATE DISTANCES
 * ========================================================================
 * NOTES:
 * - $geoNear must be first aggregation stage.
 * - Requires geospatial index.
 */

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


/**
 * ========================================================================
 * 16. DATA MODELING RULES
 * ========================================================================
 * - Data that is queried together should usually live together.
 * - Unbounded arrays should not be embedded.
 * - Many-to-many often needs references.
 * - Duplicate data is okay in NoSQL when it improves read performance.
 * - Keep writes consistent when duplicating important data.
 */

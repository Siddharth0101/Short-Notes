'use strict';

/**
 * ========================================================================
 * PAYMENTS, EMAIL, FILE UPLOADS - SHORT NOTES
 * ========================================================================
 * NOTES:
 * - Ye section production app features add karta hai.
 * - Stripe for payments, Nodemailer/SendGrid for emails, Multer/Sharp for uploads.
 */


/**
 * ========================================================================
 * 1. STRIPE CHECKOUT FLOW
 * ========================================================================
 * FLOW:
 * - User clicks book tour.
 * - Client asks backend for checkout session.
 * - Backend creates Stripe Checkout Session.
 * - Client redirects to Stripe checkout.
 * - Payment success -> user returns to app.
 * - Booking should be created safely, ideally via webhook.
 */

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//
// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.tourId);
//
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
//         cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
//         customer_email: req.user.email,
//         client_reference_id: req.params.tourId,
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd',
//                     product_data: { name: `${tour.name} Tour` },
//                     unit_amount: tour.price * 100
//                 },
//                 quantity: 1
//             }
//         ],
//         mode: 'payment'
//     });
//
//     res.status(200).json({ status: 'success', session });
// });


/**
 * ========================================================================
 * 2. STRIPE WEBHOOKS
 * ========================================================================
 * NOTES:
 * - Real production me booking webhook se create karo.
 * - Webhook Stripe ka server-to-server event hota hai.
 * - Raw body needed for signature verification.
 */

// app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);


/**
 * ========================================================================
 * 3. BOOKING MODEL
 * ========================================================================
 * NOTES:
 * - Booking user + tour + price relation store karta hai.
 * - Prevent duplicate bookings if app needs that rule.
 */

// const bookingSchema = new mongoose.Schema({
//     tour: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Tour',
//         required: [true, 'Booking must belong to a tour']
//     },
//     user: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: [true, 'Booking must belong to a user']
//     },
//     price: {
//         type: Number,
//         required: [true, 'Booking must have a price']
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now()
//     },
//     paid: {
//         type: Boolean,
//         default: true
//     }
// });


/**
 * ========================================================================
 * 4. EMAIL WITH NODEMAILER
 * ========================================================================
 * NOTES:
 * - Development: Mailtrap.
 * - Production: SendGrid or other provider.
 * - Keep email config in environment variables.
 */

// const sendEmail = async options => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });
//
//     const mailOptions = {
//         from: 'Natours <hello@natours.io>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     };
//
//     await transporter.sendMail(mailOptions);
// };


/**
 * ========================================================================
 * 5. EMAIL CLASS
 * ========================================================================
 * NOTES:
 * - Email sending ko reusable class me move karo.
 * - Welcome email, password reset email, booking email, etc.
 * - Pug templates can render HTML emails too.
 */

// class Email {
//     constructor(user, url) {
//         this.to = user.email;
//         this.firstName = user.name.split(' ')[0];
//         this.url = url;
//         this.from = `Natours <${process.env.EMAIL_FROM}>`;
//     }
//
//     async send(template, subject) {
//         // render template, create transport, send
//     }
//
//     async sendWelcome() {
//         await this.send('welcome', 'Welcome to Natours');
//     }
// }


/**
 * ========================================================================
 * 6. FILE UPLOADS WITH MULTER
 * ========================================================================
 * NOTES:
 * - Multer multipart/form-data parse karta hai.
 * - Store in memory if Sharp processing needed.
 * - File filter only images allow kare.
 */

// const multerStorage = multer.memoryStorage();
//
// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new AppError('Not an image. Please upload only images', 400), false);
//     }
// };
//
// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// });
//
// exports.uploadUserPhoto = upload.single('photo');


/**
 * ========================================================================
 * 7. IMAGE PROCESSING WITH SHARP
 * ========================================================================
 * NOTES:
 * - Resize, convert, compress images.
 * - Save consistent filenames.
 * - Store filename on req.file.filename or req.body.photo.
 */

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//     if (!req.file) return next();
//
//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//
//     await sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/users/${req.file.filename}`);
//
//     next();
// });


/**
 * ========================================================================
 * 8. MULTIPLE IMAGE UPLOADS
 * ========================================================================
 * NOTES:
 * - upload.fields for multiple named fields.
 * - Example tour imageCover + images array.
 */

// exports.uploadTourImages = upload.fields([
//     { name: 'imageCover', maxCount: 1 },
//     { name: 'images', maxCount: 3 }
// ]);


/**
 * ========================================================================
 * 9. FORM DATA
 * ========================================================================
 * NOTES:
 * - File upload ke liye JSON nahi, multipart/form-data.
 * - Client side FormData use karo.
 */

// const form = new FormData();
// form.append('name', document.getElementById('name').value);
// form.append('email', document.getElementById('email').value);
// form.append('photo', document.getElementById('photo').files[0]);


/**
 * ========================================================================
 * 10. ADVANCED FEATURE RULES
 * ========================================================================
 * - Payments should trust server-side prices, not client price.
 * - Booking creation should ideally use Stripe webhooks.
 * - Email failures in reset password flow should clear reset token fields.
 * - Uploaded files must be type-checked and size-limited.
 * - Never store API secrets in frontend JS.
 */

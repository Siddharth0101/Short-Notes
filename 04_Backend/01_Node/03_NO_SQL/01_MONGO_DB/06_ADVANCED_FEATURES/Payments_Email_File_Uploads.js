/**
 * ## Quick revision
 *
 * - SSR/Pug — server HTML banata hai; untrusted output escape karo.
 * - Upload — size/type validate; safe generated filename aur isolated storage.
 * - Payment webhook — raw-body signature verify, then durable idempotent processing.
 * - Duplicate event — unique event ID aur transaction se repeat effect roko.
 * - Email — queue/retry; API response ko slow provider par depend mat karao.
 * - Order state — payment/refund transitions explicit rakho.
 * - Deployment — secrets, health checks, logs aur graceful shutdown.
 * - Recovery — partial failure par retry/reconciliation; browser success screen final proof nahi.
 * - Signed upload — allowed size/type/object key control; uploaded file scan/validate.
 * - Webhook ack — durable receipt/process contract; retries aur duplicates expected.
 * - Email template — escape user text; provider failure par bounded retry.
 * - File path — user filename ko filesystem path authority mat do; generated safe key use.
 * - Provider timeout — external effect ho chuka ho sakta hai; retry se pehle idempotency/reconciliation.
 * - Outbox job — business write aur pending notification same durable boundary mein record.
 */

'use strict';


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


// app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);


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


// exports.uploadTourImages = upload.fields([
//     { name: 'imageCover', maxCount: 1 },
//     { name: 'images', maxCount: 3 }
// ]);


// const form = new FormData();
// form.append('name', document.getElementById('name').value);
// form.append('email', document.getElementById('email').value);
// form.append('photo', document.getElementById('photo').files[0]);

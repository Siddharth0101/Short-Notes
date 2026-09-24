/**
 * ## Quick revision
 *
 * - Authentication — identity verify; authorization — action/resource access verify.
 * - Password — adaptive hash; raw password store/log nahi.
 * - Session/token — expiry, revocation aur secure transport plan karo.
 * - JWT — signature + claims validate; decoded payload trusted nahi hota.
 * - Ownership — requested document user/tenant ka hai ya nahi, server par check.
 * - Injection — fields/operators allowlist karo; input se raw query mat banao.
 * - Rate limit — login/reset jaise sensitive endpoints protect karo.
 * - Browser security — XSS, CSRF aur cookie flags ko credential flow se match karo.
 * - Mass assignment — update fields allowlist; request body se role/owner blindly change mat karao.
 * - Session fixation — login/privilege change par suitable session identity rotation.
 * - Reset token — short-lived, single-use aur securely stored verification data.
 */

'use strict';


// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Please tell us your name']
//     },
//     email: {
//         type: String,
//         required: [true, 'Please provide your email'],
//         unique: true,
//         lowercase: true,
//         validate: [validator.isEmail, 'Please provide a valid email']
//     },
//     photo: String,
//     role: {
//         type: String,
//         enum: ['user', 'guide', 'lead-guide', 'admin'],
//         default: 'user'
//     },
//     password: {
//         type: String,
//         required: [true, 'Please provide a password'],
//         minlength: 8,
//         select: false
//     },
//     passwordConfirm: {
//         type: String,
//         required: [true, 'Please confirm your password']
//     }
// });


// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//
//     this.password = await bcrypt.hash(this.password, 12);
//     this.passwordConfirm = undefined;
//     next();
// });


// const signToken = id => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
// };


// exports.signup = catchAsync(async (req, res, next) => {
//     const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         passwordConfirm: req.body.passwordConfirm
//     });
//
//     createSendToken(newUser, 201, res);
// });


// userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
//     return await bcrypt.compare(candidatePassword, userPassword);
// };
//
// exports.login = catchAsync(async (req, res, next) => {
//     const { email, password } = req.body;
//     if (!email || !password) return next(new AppError('Please provide email and password', 400));
//
//     const user = await User.findOne({ email }).select('+password');
//     if (!user || !(await user.correctPassword(password, user.password))) {
//         return next(new AppError('Incorrect email or password', 401));
//     }
//
//     createSendToken(user, 200, res);
// });


// exports.protect = catchAsync(async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];
//     }
//
//     if (!token) return next(new AppError('You are not logged in', 401));
//
//     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//     const currentUser = await User.findById(decoded.id);
//
//     if (!currentUser) return next(new AppError('The user no longer exists', 401));
//     if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next(new AppError('Password changed recently. Please log in again', 401));
//     }
//
//     req.user = currentUser;
//     next();
// });


// exports.restrictTo = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(new AppError('You do not have permission', 403));
//         }
//         next();
//     };
// };
//
// router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteTour);


// userSchema.methods.createPasswordResetToken = function () {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//
//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
//
//     return resetToken;
// };


function filterObj(obj, ...allowedFields) {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

console.log(filterObj({ name: 'Sidd', role: 'admin' }, 'name'));


// userSchema.pre(/^find/, function (next) {
//     this.find({ active: { $ne: false } });
//     next();
// });


// const cookieOptions = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//     httpOnly: true
// };
//
// if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
// res.cookie('jwt', token, cookieOptions);


// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
//
// app.use(helmet());
// app.use('/api', rateLimit({ max: 100, windowMs: 60 * 60 * 1000 }));
// app.use(express.json({ limit: '10kb' }));
// app.use(mongoSanitize());
// app.use(xss());
// app.use(hpp({ whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'] }));

'use strict';

/**
 * ========================================================================
 * AUTHENTICATION, AUTHORIZATION, SECURITY - SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Authentication: user kaun hai?
 * - Authorization: user ko kya allowed hai?
 * - Security: app ko attacks se kaise protect kare?
 */


/**
 * ========================================================================
 * 1. USER MODEL
 * ========================================================================
 * NOTES:
 * - Password DB me plain text kabhi store nahi.
 * - passwordConfirm only validation ke liye, DB me save nahi.
 * - select: false sensitive fields default query se hide karta hai.
 */

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


/**
 * ========================================================================
 * 2. HASHING PASSWORDS
 * ========================================================================
 * NOTES:
 * - bcrypt password ko one-way hash banata hai.
 * - pre('save') middleware me password hash karo.
 * - passwordConfirm ko undefined set karo so DB me save na ho.
 */

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//
//     this.password = await bcrypt.hash(this.password, 12);
//     this.passwordConfirm = undefined;
//     next();
// });


/**
 * ========================================================================
 * 3. JWT AUTH FLOW
 * ========================================================================
 * FLOW:
 * - Signup/login success.
 * - Server JWT sign karta hai using secret.
 * - Client token store/send karta hai.
 * - Protected route pe server token verify karta hai.
 * - Token valid -> req.user set -> next.
 */

// const signToken = id => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
// };


/**
 * ========================================================================
 * 4. SIGNUP
 * ========================================================================
 * NOTES:
 * - Signup me allowed fields explicitly pick karo.
 * - User role client se blindly accept mat karo.
 * - Create user, token issue, response.
 */

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


/**
 * ========================================================================
 * 5. LOGIN
 * ========================================================================
 * NOTES:
 * - Email/password present check.
 * - User find with password selected.
 * - bcrypt compare.
 * - Wrong credentials -> 401.
 */

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


/**
 * ========================================================================
 * 6. PROTECT MIDDLEWARE
 * ========================================================================
 * NOTES:
 * - Bearer token header se token nikalo.
 * - jwt.verify token validate karta hai.
 * - User still exists check.
 * - Password changed after token issued check.
 */

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


/**
 * ========================================================================
 * 7. AUTHORIZATION / ROLES
 * ========================================================================
 * NOTES:
 * - restrictTo returns middleware.
 * - Only selected roles allowed.
 */

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


/**
 * ========================================================================
 * 8. PASSWORD RESET TOKEN
 * ========================================================================
 * NOTES:
 * - User requests reset.
 * - Generate raw token.
 * - Hash token in DB.
 * - Email raw token link.
 * - Later hash incoming token and compare with DB.
 */

// userSchema.methods.createPasswordResetToken = function () {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//
//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
//
//     return resetToken;
// };


/**
 * ========================================================================
 * 9. RESET PASSWORD
 * ========================================================================
 * NOTES:
 * - Hash URL token.
 * - Find user where token matches and expiry future.
 * - Set new password/passwordConfirm.
 * - Save user so validators and pre-save password hash run.
 * - Send new JWT.
 */


/**
 * ========================================================================
 * 10. UPDATE PASSWORD
 * ========================================================================
 * NOTES:
 * - Logged-in user current password provide kare.
 * - Verify current password.
 * - Set new password.
 * - Save document, not findByIdAndUpdate, because password middleware needed.
 */


/**
 * ========================================================================
 * 11. UPDATE CURRENT USER DATA
 * ========================================================================
 * NOTES:
 * - Password update route separate rakho.
 * - Body filter karo: only name/email allowed.
 * - findByIdAndUpdate okay for non-password fields.
 */

function filterObj(obj, ...allowedFields) {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

console.log(filterObj({ name: 'Sidd', role: 'admin' }, 'name'));


/**
 * ========================================================================
 * 12. SOFT DELETE USER
 * ========================================================================
 * NOTES:
 * - User document delete karne ke bajay active=false.
 * - Query middleware inactive users hide kar sakta hai.
 */

// userSchema.pre(/^find/, function (next) {
//     this.find({ active: { $ne: false } });
//     next();
// });


/**
 * ========================================================================
 * 13. JWT IN COOKIE
 * ========================================================================
 * NOTES:
 * - httpOnly cookie JS se inaccessible hoti hai.
 * - secure cookie HTTPS pe only send hoti hai.
 * - sameSite CSRF protection me help karta hai.
 */

// const cookieOptions = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//     httpOnly: true
// };
//
// if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
// res.cookie('jwt', token, cookieOptions);


/**
 * ========================================================================
 * 14. SECURITY BEST PRACTICES
 * ========================================================================
 * NOTES:
 * - Use HTTPS.
 * - Hash passwords with bcrypt.
 * - Store JWT secret in env var.
 * - Use short token expiry where possible.
 * - Use secure, httpOnly cookies.
 * - Rate limit auth/API routes.
 * - Set security headers.
 * - Sanitize NoSQL operators from body/query/params.
 * - Sanitize HTML to reduce XSS.
 * - Prevent parameter pollution.
 * - Validate and whitelist input.
 * - Never leak stack traces in production.
 */


/**
 * ========================================================================
 * 15. SECURITY MIDDLEWARE STACK
 * ========================================================================
 */

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

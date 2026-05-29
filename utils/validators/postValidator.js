const { check } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validatorMiddleware")


// Create
exports.createPostValidator = [
    check('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Too short post title'),
    
    check('content')
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 20 }).withMessage('Post content must be at least 20 characters'),

    

    validatorMiddleware,
];

// Get Single Post
exports.getPostValidator = [
    check('id').isMongoId().withMessage('Invalid Post ID format'),
    validatorMiddleware,
];

// Update
exports.updatePostValidator = [
    check('id').isMongoId().withMessage('Invalid Post ID format'),
    
    check('title')
        .optional()
        .isLength({ min: 3 }).withMessage('Too short post title'),
    
    check('content')
        .optional()
        .isLength({ min: 20 }).withMessage('Post content must be at least 20 characters'),
    
    

    validatorMiddleware,
];

// Delete
exports.deletePostValidator = [
    check('id').isMongoId().withMessage('Invalid Post ID format'),
    validatorMiddleware,
];
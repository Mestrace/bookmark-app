const mongoose = require('mongoose');

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Add length limits to the schema
const bookmarkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: isValidUrl,
            message: 'Invalid URL format'
        }
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        maxlength: 1000
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: (tags) => tags.length <= 10,
            message: 'Maximum 10 tags allowed'
        }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
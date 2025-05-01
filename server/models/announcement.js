const mongoose = require('mongoose');
const { Schema } = mongoose;

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: 'faculty',
        required: true,
        index: true // Adding index for better performance on queries
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    department: {
        type: String,
        required: true,
        enum: ['ECE', 'CSE', 'IT', 'Mechanical'] // Optional: Use enum to restrict departments
    }
}, { timestamps: true }); // This will add both createdAt and updatedAt fields

module.exports = mongoose.model('announcement', announcementSchema);

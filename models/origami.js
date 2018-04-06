var mongoose = require('mongoose');

const OrigamiSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    origamititle: {
        type: String,
        unique: true,
	required: true,
    },
    origamidescription: {
        type: String,
    },
origamipath:{type:String,require:true},
    commentaArray: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	    title: {
                type: String,
            },

            comment: {
                type: String,
            },
            Date: {
                type: Date,  default: Date.now(),
            },
        }
    ],
    tags: [{type: String}],
    likes: {type: Array, default: []},
    dislikes: {type: Array, default: []},
    Date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Origami', OrigamiSchema);

const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');


router.get('/', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
        res.json(bookmarks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    const { url, title, description, tags } = req.body;

    if (!url || !title) {
        return res.status(400).json({ msg: 'Please include a URL and Title' });
    }

    try {
        const newBookmark = new Bookmark({
            url,
            title,
            description,
            tags
        });

        const bookmark = await newBookmark.save();
        res.status(201).json(bookmark);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);
        
        if (!bookmark) {
            return res.status(404).json({ msg: 'Bookmark not found' });
        }

        await bookmark.deleteOne();
        res.json({ msg: 'Bookmark removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Bookmark not found' });
        }
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    const { url, title, description, tags } = req.body;

    const bookmarkFields = {};
    if (url) bookmarkFields.url = url;
    if (title) bookmarkFields.title = title;
    if (description) bookmarkFields.description = description;
    if (tags) bookmarkFields.tags = tags;

    try {
        let bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ msg: 'Bookmark not found' });
        }

        bookmark = await Bookmark.findByIdAndUpdate(
            req.params.id,
            { $set: bookmarkFields },
            { new: true }
        );

        res.json(bookmark);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Bookmark not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
const router = require('express').Router();
const {getComment, saveComment} = require('../controller/commentsController') ;


router.route('/getcomment/:id').get(getComment);

router.route('/savecomment').post(saveComment);

module.exports = router;
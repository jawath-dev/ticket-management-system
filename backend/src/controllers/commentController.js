const commentRepository = require("../repositories/commentRepository");

async function getComments(req, res, next) {
  try {
    const comments = await commentRepository.getCommentsByTicketId(
      req.params.id,
    );
    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

async function createComment(req, res, next) {
  try {
    const { userId, comment } = req.body;

    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment is required" });
    }

    const commentId = await commentRepository.addComment(
      req.params.id,
      userId,
      comment,
    );
    res.status(201).json({ success: true, data: { id: commentId } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getComments, createComment };

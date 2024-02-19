const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const getAllThoughts = await Thought.find({});
      res.json(getAllThoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get single thought
  async getSingleThought(req, res) {
    try {
      const singleThought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!singleThought) {
        return res
          .status(404)
          .json({ message: "No Thought found with that ID" });
      }
      res.json(singleThought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //create a thought and add the created thought's _id to the associated user's thoughts array
  async createThought(req, res) {
    try {
      const createThought = await Thought.create(req.body);
      if (!createThought) {
        return res.status(404).json({ message: "No User found with this ID!" });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: createThought._id } },
        { new: true }
      );

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //update a thought
  async updateThought(req, res) {
    try {
      const updateThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, New: true }
      );

      if (!updateThought) {
        return res
          .status(404)
          .json({ message: "No Thought found with this ID:" });
      }

      res.json(updateThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //delete a thought
  async deleteThought(req, res) {
    try {
      const deleteThought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!deleteThought) {
        res.status(404).json({ message: "No Thought found with this ID" });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "Thought deleted, but no user found" });
      }

      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //create reaction
  async createReaction(req, res) {
    try {
      const create = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!create) {
        return res
          .status(404)
          .json({ message: "No Thought found with this ID:" });
      }

      res.json(create);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //delete reaction
  async deleteReaction(req, res) {
    try {
      const deleteReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!deleteReaction) {
        return res
          .status(404)
          .json({ message: "No Thought found with this ID:" });
      }

      res.json(deleteReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

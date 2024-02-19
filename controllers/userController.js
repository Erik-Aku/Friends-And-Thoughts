const { User, Thought } = require("../models");

module.exports = {
  //Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //Get a single user
  async getSingleUser(req, res) {
    try {
      const singleUser = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends")
        .select("-__v");

      if (!singleUser) {
        return res.status(404).json({ message: "No User find with that ID!" });
      }

      res.json(singleUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //create a user
  async createUser(req, res) {
    try {
      const createUser = await User.create(req.body);
      res.json(createUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //update a user
  async updateUser(req, res) {
    try {
      const updateUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updateUser) {
        return res.status(404).json({ message: "No User found with this ID:" });
      }

      res.json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Delete a user
  //Bonus Work: Remove a user's associated thoughts when deleted.
  async deleteUser(req, res) {
    try {
      const deleteUser = await User.findOneAndDelete({
        _id: req.params.userId,
      });

      if (!deleteUser) {
        res.status(404).json({ message: "No User found with this ID" });
      } else {
        Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: "User and Thought have been deleted" });
      }
    } catch (err) {
      res.json(500).json(err);
    }
  },
  //add a friend
  async addFriend(req, res) {
    try {
      const addFriend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!addFriend) {
        res.status(404).json({ message: "Did not find User with this ID" });
      }
      res.json(addFriend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //delete a friend
  async deleteFriend(req, res) {
    try {
      const deleteFriend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!deleteFriend) {
        res.status(404).json({ message: "Did not find User with this ID" });
      }
      res.json(deleteFriend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

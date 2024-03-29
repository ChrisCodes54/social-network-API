const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  getThoughts(req, res) {
    // TODO: Your code here
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  
  // get single thought by id
  getSingleThought(req, res) {
    // TODO: Your code
    Thought.findOne({_id: req.params.thoughtId}) 
    .select('-__v')
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: 'No thought was found with that ID' })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },

  // create a thought
  createThought(req, res) {
    // TODO: create a thought and add the thought to user's thoughts array
    Thought.create(req.body)
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err))

  },

  // update thought
  updateThought(req, res) {
    // TODO: update thought
    Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    )
    .then((dbThoughtsData) => {
      if (!dbThoughtsData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
      res.json(dbThoughtsData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  // delete thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }

        // remove thought id from user's `thoughts` field
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: { thoughtId: req.params.thoughtId }} },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Thought created but no user with this id!' });
        }
        res.json({ message: 'Thought successfully deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // add a reaction to a thought
  addReaction(req, res) {
    //  TODO: add reaction to thought's reaction array
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, 
      { $addToSet: { reactions: req.body} }, { new: true })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

  },

  // remove reaction from a thought
  removeReaction(req, res) {
    // TODO: remove reaction from thoughts
    Thought.findOneAndUpdate({_id: req.params.thoughtId},
       {$pull: {reactions: {reactionId: req.params.reactionId}}}, {new: true})
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },
};

module.exports = thoughtController;

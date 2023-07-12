const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!profile) {
        throw new AuthenticationError('No profile with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      try {
        // Check if the user is authenticated
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const user = await User.findById(context.user._id);
        if (!user) {
          throw new Error('User not found');
        }

        // Add the book to the user's savedBooks array
        user.savedBooks.push(input);
        user.bookCount = user.savedBooks.length;

        // Save the updated user
        await user.save();

        return user;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to save book');
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      try {
        // Check if the user is authenticated
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const user = await User.findById(context.user._id);
        if (!user) {
          throw new Error('User not found');
        }

        // Find the index of the book to remove
        const bookIndex = user.savedBooks.findIndex((book) => book.bookId === bookId);
        if (bookIndex === -1) {
          throw new Error('Book not found');
        }

        // Remove the book from the user's savedBooks array
        user.savedBooks.splice(bookIndex, 1);
        user.bookCount = user.savedBooks.length;

        // Save the updated user
        await user.save();

        return user;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to remove book');
      }
    },
  },
};

module.exports = resolvers;

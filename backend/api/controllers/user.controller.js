const { client } = require("../config/mongoDB");
const database = client.db("LearnUp");
const userCollection = database.collection("users");
const { ObjectId } = require("mongodb");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utilities/errorHandler");

exports.userUpdate = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Dynamically build the update object
    const updateFields = {};

    // Only include fields if they are not null or undefined
    if (req.body.userPhoto !== null && req.body.userPhoto !== undefined) {
      updateFields.userPhoto = req.body.userPhoto;
    }
    if (req.body.userName !== null && req.body.userName !== undefined) {
      updateFields.userName = req.body.userName;
    }
    if (req.body.userBirth !== null && req.body.userBirth !== undefined) {
      updateFields.userBirth = req.body.userBirth;
    }
    if (req.body.userPhone !== null && req.body.userPhone !== undefined) {
      updateFields.userPhone = req.body.userPhone;
    }
    if (req.body.userAddress !== null && req.body.userAddress !== undefined) {
      updateFields.userAddress = req.body.userAddress;
    }
    if (req.body.userGender !== null && req.body.userGender !== undefined) {
      updateFields.userGender = req.body.userGender;
    }

    const updateDoc = { $set: updateFields };

    // Set options for upsert if needed
    const options = { returnDocument: "after" };

    // Update the user document
    const updatedUser = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Filter by user ID
      updateDoc,
      options
    );

    // Remove the password from the user object before sending it back to the client
    const { userPassword, ...userInfo } = updatedUser;

    // Send a success response
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      userInfo,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const { userPassword, newPassword } = req.body; // Destructure old and new passwords from request body

  try {
    // Fetch the user from the database by ID
    const validUser = await userCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Compare the provided current password with the stored hashed password
    const validPassword = await bcryptjs.compare(userPassword, validUser.userPassword);

    // If the current password is incorrect, return an error
    if (!validPassword) {
      return next(errorHandler(401, "Invalid current password"));
    }

    // Hash the new password before saving it to the database
    const newUserPassword = bcryptjs.hashSync(newPassword, 10);

    // Update the user's password in the database
    const updateDoc = {
      $set: { userPassword: newUserPassword },
    };

    const options = { returnDocument: "after" };

    const updatedUser = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) }, // Filter by user ID
      updateDoc,
      options
    );

    // Remove the password from the user object before sending it back to the client
    const { userPassword: pass, ...userInfo } = updatedUser;

    // Send a success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      userInfo,
    });
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  const { userPassword, isGoogle } = req.body; // Destructure current password and isGoogle from request body

  try {
    if (isGoogle) {
      // Delete the Google user from the database
      const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(req.params.id) });

      // Clear cookies
      res.clearCookie("learnupRefreshToken");

      // Send a success response
      return res.status(200).json({
        success: true,
        message: "Google account deleted successfully",
      });
    } else {
      // Ensure that the userPassword is not undefined
      if (!userPassword) {
        return next(errorHandler(400, "Current password is required"));
      }

      // Fetch the user from the database by ID
      const validUser = await userCollection.findOne({ _id: new ObjectId(req.params.id) });

      // Compare the provided current password with the stored hashed password
      const validPassword = await bcryptjs.compare(userPassword, validUser.userPassword);

      // If the current password is incorrect, return an error
      if (!validPassword) {
        return next(errorHandler(401, "Invalid current password"));
      }

      // Delete the user from the database
      const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(req.params.id) });

      // Clear cookies
      res.clearCookie("learnupRefreshToken");

      // Send a success response
      return res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    }
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

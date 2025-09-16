import User from "../Models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    
    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required." });
    }

    let user = await User.findOne({ email });

    
    if (!user) {
      user = new User({ 
        name, 
        email, 
        address
      });
      await user.save();
    }


    res.status(200).json(user);
  } catch (error) {
    console.error("Error creating or finding user:", error);
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
};
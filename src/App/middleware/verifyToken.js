const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  console.log("Join to verifyToken  ");

  // Safely access the Authorization header and split the token
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }


  try {
    // Verify the token using jwt.verify
    const decoded = jwt.verify(token, "Nextwaves@2023");
    
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token has expired. Please login again." });
    }
    return res.status(400).json({ error: "Invalid token." });
  }
}

module.exports = verifyToken;

const { rankIssue } = require("../scoring/rankIssues");

const UserPreference = async (req, res) => {
  try {
    const { profile, language, level } = req.body;
    console.log("📥 Received user preferences:", req.body);

    let userProfile;
    if (Array.isArray(profile) && profile.length > 0) {
      userProfile = profile;
    } else if (language && level) {
      userProfile = [{ name: language, level }];
    } else {
      return res.status(400).json({
        error: "Request body must include a profile array or language and level",
      });
    }

    const rank = await rankIssue(userProfile);
    return res.json(rank);
  } catch (error) {
    console.error("Error ranking issues:", error);
    return res.status(500).json({ error: "Failed to rank issues" });
  }
};

module.exports = { UserPreference };
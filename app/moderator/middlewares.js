const Moderator = require("./models/Moderator");

const isModerator = async (req, res, next) => {
  try {
    // Проверяем, существует ли пользователь с данным ID и имеет ли он роль модератора
    const moderator = await Moderator.findByPk(req.user.id);

    if (!moderator) {
      return res.status(403).json({ message: "Access denied: Only moderators can perform this action" });
    }

    // Передаем управление следующему middleware или маршруту
    next();
  } catch (error) {
    console.error("Error checking moderator:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { isModerator };

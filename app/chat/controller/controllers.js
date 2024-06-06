const { Room } = require('../models/Room');
const { Message } = require('../models/Message');
const { Volunteer } = require('../../auth/models/Volunteer');
const { Organization } = require('../../auth/models/Organization');

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        { model: Volunteer },
        { model: Organization },
      ],
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { roomId: req.query.roomId },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

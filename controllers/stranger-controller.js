const Message = require('../models/message-model');
const Stranger = require('../models/stranger-model');

//List of Strangers
const strangerAdd = async (req, res) => {
    try {
        const data = req.body;
        const stranger = new Stranger(data);
        const saved = await stranger.save();
        res.status(201).json(saved);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const strangerUpdate = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const stranger = await Stranger.findByIdAndUpdate(id, data, {new: true});
        console.log(stranger);
        
        res.status(201).json(stranger);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const strangerList = async (req, res) => {
    try {
        const { id } = req.params;
        const strangers = await Stranger.find({ _id: { $ne: id }, isActive: true });
        res.status(201).json(strangers);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const strangerById = async (req, res) => {
    try {
        const { id } = req.params;
        const stranger = await Stranger.findById(id);
        res.status(201).json(stranger);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const strangerHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const strangers = await Message.find({ $or: [{ sender: id }, { receiver: id }] });
        res.status(201).json(strangers);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const inActiveStranger = async (req, res) => {
    const { id } = req.params;
    try {
        const stranger = await Stranger.findByIdAndUpdate(id, {isActive: false});
        res.status(201).json(stranger);
    } catch (error) {
        res.status(500).json({ message: "Error removing user from active list." });
    }
};

const removeStranger = async (req, res) => {
    const { id } = req.params;

    try {
        const exists = await Message.exists({ $or: [{ sender: id }, { receiver: id }] });
        
        if (!exists) {
            await Stranger.findByIdAndDelete(id);
            res.status(200).json({ message: `${id} removed from all active devices.` });
        }
        else {
            res.status(201).json({message: "Message Pending"});
        }
    } catch (error) {
        res.status(500).json({ message: "Error removing user from active list." });
    }
};


module.exports = { strangerAdd, strangerUpdate, strangerList, strangerById, strangerHistory, inActiveStranger, removeStranger }
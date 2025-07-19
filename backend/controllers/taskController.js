import noteModel from "../models/task.js";
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.userId
    console.log(userId,"GET")
    const data = await noteModel.find({ user: userId}).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await noteModel.findById(id);
  res.status(200).json(user);
};

export const postAllUsers = async (req, res) => {
  try {
    console.log(req.body)
    const { title, content, status } = req.body;
    const userId = req.userId
    console.log(userId)
    console.log(title,content,status,userId,"55")
    const savedData = await noteModel.create({ title, content, status,user:userId });
    // res.status(201).json(savedData);
    await noteModel.findByIdAndUpdate(userId,{
      $push:{taskList:savedData._id}
    })
     res.status(201).json({ success: true, savedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editAllUsers = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const id = req.params.id;

    const updatedData = await noteModel.findByIdAndUpdate(
      id,
      { title, content, status },
      { new: true, runValidators: true }
    );

    if (!updatedData) return res.json({ message: "Note not found" });

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const deleteUser = await noteModel.findByIdAndDelete(id);

  if (!deleteUser) return res.json({ message: "Not found" });

  res.json(deleteUser);
};

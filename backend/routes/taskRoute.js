import express from 'express';
import { deleteUser, editAllUsers, getAllUsers, getUser, postAllUsers } from '../controllers/taskController.js';
import { userAuthMiddleware } from '../middileware/userAuth.js';

// import {
//   getAllUsers,
//   postAllUsers,
//   editAllUsers,
//   deleteUser,
//   getUser
// } from '../Controllers/taskController.js';

const taskRouter = express.Router();

taskRouter.get("/",userAuthMiddleware, getAllUsers);
taskRouter.get("/:id", userAuthMiddleware,getUser);
taskRouter.post("/", userAuthMiddleware,postAllUsers);
taskRouter.put("/:id",userAuthMiddleware, editAllUsers);
taskRouter.delete("/:id",userAuthMiddleware, deleteUser);

export { taskRouter };

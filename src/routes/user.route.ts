import { NextFunction, Request, Response, Router } from "express";
import authenticate from "../../middlewares/authenticate";
import { canAccess } from "../../middlewares/canAccess";
import { AppDataSource } from "../config/data-source";
import { logger } from "../config/logger";
import { roles } from "../constants";
import { UserController } from "../controllers/UserController";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import createUserValidators from "../validator/create-user-validators";
import updateUserValidator from "../validator/update-user-validator";
import listUsersValidator from "../validator/list-users-validator";

const userRouter = Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

userRouter.post(
  "/",
  createUserValidators,
  authenticate,
  canAccess([roles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.create(req, res, next);
  }
);
userRouter.patch(
  "/:id",
  updateUserValidator,
  authenticate,
  canAccess([roles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.update(req, res, next);
  }
);
userRouter.get(
  "/:id",
  authenticate,
  canAccess([roles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.getSingleUser(req, res, next);
  }
);
userRouter.get(
  "/",
  listUsersValidator,
  authenticate,
  canAccess([roles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.getAllUser(req, res, next);
  }
);

userRouter.delete(
  "/:id",
  authenticate,
  canAccess([roles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.deleteSingleUser(req, res, next);
  }
);
userRouter.delete(
  "/",
  authenticate,
  canAccess([roles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.deleteAllUser(req, res, next);
  }
);

export default userRouter;

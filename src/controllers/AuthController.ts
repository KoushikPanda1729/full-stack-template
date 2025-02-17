import { NextFunction, Response } from "express";
import { IRequestBody } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { roles } from "../constants";
import { validationResult } from "express-validator";

export class AuthController {
  public UserService: UserService;
  public logger: Logger;
  constructor(userService: UserService, logger: Logger) {
    this.UserService = userService;
    this.logger = logger;
  }
  async register(req: IRequestBody, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, gmail, password, role } = req.body;

    this.logger.debug("New user registered", {
      firstName,
      lastName,
      gmail,
      password: "**********",
      role,
    });
    try {
      const user = await this.UserService.create({
        firstName,
        lastName,
        gmail,
        password,
        role: roles.CUSTOMER,
      });
      this.logger.info("User register successfully", { id: user.id });
      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }
}

import { Get, Route, Tags, Post, Path } from "tsoa";
import { Manager } from "../models";
import {
  createManager,
  getManager,
  getAllManagers
} from "../repositories/manager";

@Route("managers")
@Tags("Manager")
export default class ManagerController {
  @Post("/")
  public async createManager(): Promise<Manager> {
    return createManager();
  }

  @Get("/:AuthToken")
  public async getManager(@Path() AuthToken: string): Promise<Manager | null> {
    return getManager(AuthToken);
  }

  @Get("/")
  public async getAllManagers(): Promise<Manager[] | null> {
    return getAllManagers();
  }
}
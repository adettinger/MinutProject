import { Get, Route, Tags, Post, Body, Path } from "tsoa";
import { Manager } from "../models";
import {
  createManager,
  getManager,
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
}
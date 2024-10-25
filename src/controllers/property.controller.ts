import { Get, Route, Tags, Post, Body, Path } from "tsoa";
import { Property } from "../models";
import {
  getPropertys,
  createProperty,
  IPropertyPayload
} from "../repositories/property";

@Route("posts")
@Tags("Property")
export default class PostController {
  @Get("/:AuthToken")
  public async getPropertys(@Path() AuthToken: string): Promise<Array<Property> | null> {
    return getPropertys(AuthToken);
  }

  @Post("/")
  public async createProperty(@Body() body: IPropertyPayload): Promise<Property | null> {
    return createProperty(body);
  }
}
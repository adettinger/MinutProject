import { Get, Route, Tags, Post, Body, Path } from "tsoa";
import { Reservation } from "../models";
import {
  getReservations,
  createReservation,
  IReservationPayload
} from "../repositories/reservation";

@Route("posts")
@Tags("Reservation")
export default class PostController {
  @Get("/{AuthToken}/{PropertyId}")
  public async getReservations(@Path() AuthToken: string, PropertyId: number): Promise<Array<Reservation> | null> {
    return getReservations(AuthToken, PropertyId);
  }

  @Post("/")
  public async createReservation(@Body() body: IReservationPayload): Promise<Reservation | null> {
    return createReservation(body);
  }
}
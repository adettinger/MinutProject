import { Get, Route, Tags, Post, Body, Path } from "tsoa";
import { Reservation } from "../models";
import {
  getReservations,
  createReservation,
  deleteReservation,
  IReservationPayload,
  IDeleteReservationPayload
} from "../repositories/reservation";
import { DeleteResult } from "typeorm";

@Route("posts")
@Tags("Reservation")
export default class ReservationController {
  @Get("/{AuthToken}/{PropertyId}")
  public async getReservations(@Path() AuthToken: string, PropertyId: number): Promise<Array<Reservation> | null> {
    return getReservations(AuthToken, PropertyId);
  }

  @Post("/")
  public async createReservation(@Body() body: IReservationPayload): Promise<Reservation | null> {
    return createReservation(body);
  }

  @Post("/delete/")
  public async deleteReservation(@Body() body: IDeleteReservationPayload): Promise<DeleteResult | null> {
    return deleteReservation(body);
  }
}
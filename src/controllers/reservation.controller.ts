import { Get, Route, Tags, Post, Body, Path } from "tsoa";
import { Reservation } from "../models";
import {
  getReservations,
  createReservation,
  deleteReservation,
  IReservationPayload,
  IUpdateReservationPayload,
  checkInReservation,
  checkOutReservation
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
  public async deleteReservation(@Body() body: IUpdateReservationPayload): Promise<DeleteResult | null> {
    return deleteReservation(body);
  }

  @Post("/checkIn/")
  public async checkInReservation(@Body() body: IUpdateReservationPayload): Promise<Reservation | null> {
    return checkInReservation(body);
  }

  @Post("/checkOut/")
  public async checkOutReservation(@Body() body: IUpdateReservationPayload): Promise<Reservation | null> {
    return checkOutReservation(body);
  }
}
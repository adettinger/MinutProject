import { DeleteResult, getRepository } from "typeorm";
import { Manager, Property, Reservation } from "../models";

export interface IReservationPayload {
    AuthToken: string;
    PropertyId: number;
    GuestEmail: string;
    GuestPhone: number;
    Start: Date;
    End: Date;
}

export interface IDeleteReservationPayload {
    AuthToken: string;
    ReservationId: number;
}

export const getReservations = async (AuthToken: string, PropertyId: number): Promise<Reservation[] | null> => {
    // Check manager owns this property
    const propertyRepository = getRepository(Property);
    const property = await propertyRepository.findOne({ 
        where: {
            id: PropertyId,
        },
    });
    if (!property) return null;
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            id: property["managerId"],
            AuthToken: AuthToken
        }
    });
    if (!manager) return null;

    //get the reservation if exists
    const reservationRepository = getRepository(Reservation);
    const reservations = await reservationRepository.find({ 
        where: {
            id: PropertyId,
        },
    });

    if (!reservations) return null
    return reservations;
  };

export const createReservation = async (payload: IReservationPayload): Promise<Reservation | null> => {
    // Check manager owns this property
    const propertyRepository = getRepository(Property);
    const property = await propertyRepository.findOne({ 
        where: {
            id: payload["PropertyId"],
        },
    });
    if(!property) return null;
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            id: property["managerId"],
            AuthToken: payload["AuthToken"]
        }
    });
    if (!manager) return null;

    //create a new reservation
    const reservationRepository = getRepository(Reservation);
    let reservation = new Reservation();
    reservation["propertyId"] = property["id"];
    reservation["guestEmail"] = payload["GuestEmail"];
    reservation["guestPhone"] = payload["GuestPhone"];
    reservation["start"] = payload["Start"];
    reservation["end"] = payload["End"];
    return reservationRepository.save({
    ...reservation,
    });
};

export const deleteReservation = async (payload: IDeleteReservationPayload): Promise<DeleteResult | null> => {
    //Get manager
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            AuthToken: payload["AuthToken"]
        }
    });
    if (!manager) return null;
    //get reservation
    const reservationRepository = getRepository(Reservation);
    const reservation = await reservationRepository.findOne({ 
        where: {
            id: payload["ReservationId"]
        }
    });
    if (!reservation) return null;
    //verify reservation owned by this manager
    const propertyRepository = getRepository(Property);
    const property = await propertyRepository.findOne({ 
        where: {
            id: reservation["propertyId"],
            managerId: manager["id"],
        },
    });
    if(!property) return null;

    //delete reservation
    return reservationRepository.delete(reservation["id"]);
};
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

export interface IUpdateReservationPayload {
    AuthToken: string;
    ReservationId: number;
}

//Helper method to check that the property is owned by this manager
export const checkPropertyOwnership = async (authToken: string, propertyId: number): Promise<Boolean | null> => {
    // Check manager owns this property
    const propertyRepository = getRepository(Property);
    const property = await propertyRepository.findOne({ 
        where: {
            id: propertyId,
        },
    });
    if (!property) return null;
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            id: property["managerId"],
            AuthToken: authToken
        }
    });
    if (!manager) return null;
    return true;
};

//Helper method to check this reservation is owned by this manager
export const checkReservationOwnership = async (authToken: string, reservationId: number): Promise<Reservation | null> => {
    //Get manager
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            AuthToken: authToken,
        }
    });
    if (!manager) return null;
    //get reservation
    const reservationRepository = getRepository(Reservation);
    const reservation = await reservationRepository.findOne({ 
        where: {
            id: reservationId,
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
    return reservation;
};

//Get reservations for this property. Must include authToken to prove manager owns this property
export const getReservations = async (AuthToken: string, PropertyId: number): Promise<Reservation[] | null> => {
    let ownershipCheck = await checkReservationOwnership(AuthToken, PropertyId);
    if (!ownershipCheck) return null;

    //get the reservation if exists
    const reservationRepository = getRepository(Reservation);
    const reservations = await reservationRepository.find({ 
        where: {
            propertyId: PropertyId,
        },
    });

    if (!reservations) return null
    return reservations;
  };

// Create a reservation for property. Must include authToken to prove manager owns this property
// Reservation can only be created if there is no conflicting reservations at this property
export const createReservation = async (payload: IReservationPayload): Promise<Reservation | null> => {
    let ownershipCheck = await checkReservationOwnership(payload["AuthToken"], payload["PropertyId"]);
    if (!ownershipCheck) return null;

    //create a new reservation
    let reservation = new Reservation();
    reservation["propertyId"] = payload["PropertyId"];
    reservation["guestEmail"] = payload["GuestEmail"];
    reservation["guestPhone"] = payload["GuestPhone"];
    reservation["start"] = new Date(payload["Start"]);
    reservation["end"] = new Date(payload["End"]);

    // Verify there are no reservation conflicts
    const reservationRepository = getRepository(Reservation);
    const reservations = await reservationRepository.find({ 
        where: {
            propertyId: payload["PropertyId"],
        },
    });

    for(var i = 0; i < reservations.length; i++) {
        if (reservations[i]["start"] <= reservation["start"]) {
            if (reservation["start"] < reservations[i]["end"]) {
                // If existing reservation starts before new starts, and ends afer new starts, conflict
                // In future, would throw specific error message
                return null;
            }
        } else {
            if (reservations[i]["start"] < reservation["end"]) {
                // If existing reservation starts after new starts but before new ends, conflict
                // In future, would throw specific error message
                return null;
            }
        }
    }
    //If pass validation, save the new reservation
    return reservationRepository.save({
        ...reservation,
    });
};

//Delete reservation. Must include authToken to prove manager owns this property
export const deleteReservation = async (payload: IUpdateReservationPayload): Promise<DeleteResult | null> => {
    const reservation = await checkReservationOwnership(payload["AuthToken"], payload["ReservationId"]);
    if (!reservation) return null;
    //delete reservation
    const reservationRepository = getRepository(Reservation);
    return reservationRepository.delete(reservation["id"]);
};

// CheckIn reservation. Property must not already be checkedIn. Early/late checkIn is allowed
// Must include authToken to prove manager owns this property
export const checkInReservation = async (payload: IUpdateReservationPayload): Promise<Reservation | null> => {
    let reservation = await checkReservationOwnership(payload["AuthToken"], payload["ReservationId"]);
    if (!reservation) return null;
    //Cannot checkIn if already checkedIn
    if (reservation["checkIn"]) return null;
    //CheckIn reservation
    const reservationRepository = getRepository(Reservation);
    reservation["checkIn"] = new Date();
    return reservationRepository.save({
        ...reservation,
    });
};

// CheckIn reservation. Property must be already be checkedIn and not checkedout. Early/late checkOut is allowed
// Must include authToken to prove manager owns this property
export const checkOutReservation = async (payload: IUpdateReservationPayload): Promise<Reservation | null> => {
    let reservation = await checkReservationOwnership(payload["AuthToken"], payload["ReservationId"]);
    if (!reservation) return null;
    //Can only checkOut if reservation is checkedIn and not already checkedOut
    if (!reservation["checkIn"] || reservation["checkOut"]) return null;
    //CheckOut reservation
    const reservationRepository = getRepository(Reservation);
    reservation["checkOut"] = new Date();
    return reservationRepository.save({
        ...reservation,
    });
};
# Minut Backend Challenge: The Booking System

This project creates a basic API for a booking system for managers to create properties and reservations.  
- All endpoints besides getAllManagers requires an authToken (retrieved when you create a manager) to maintain security
- Manager, property & reservation ids are shown to the user. In a production application, these would be obscured

## Build & Run the application
The project is built with node.js, but scripts are setup for docker to handle all building & updating.  
To start the application, run the following commands:  
`docker-compose build`  
`docker-compose up`  

## Endpoints
### Ping
Endpoint for testing server response status  
  http://localhost:8000/ping/

### Create Manager  
Create a manager to be used to manage properties and reservations  
`curl -X POST -H "Content-Type: application/json" -d '' http://localhost:8000/managers`  
### Get manager info  
Gets all manager information for this manager  
*This would not exist in production*  
  `curl http://localhost:8000/managers/<AuthToken>`  
### Get All Managers  
Gets information for all managers in the application  
*This would not exist in production*  
  `curl http://localhost:8000/managers`/  

### Create Property
Create a property owned by the manager  
- Property Name is any string  

`curl -d '{"AuthToken":"<AuthToken>", "name":"<Property name>"}' -H "Content-Type: application/json" -X POST http://localhost:8000/propertys`
### Get Properties
Get all properties owned by manager  
`curl http://localhost:8000/propertys/<AuthToken>`

### Create Reservation
Create a reservation for a property owned by this manager  
Reservation will not be created if it conflicts with another reservation for this property  
- Guest Email is a string  
- Guest phone # is a number  
- Dates can be any valid date formant (ie. "2024-9-22")

`curl -d '{"AuthToken":"<AuthToken>", "PropertyId":"<Property ID>", "GuestEmail":"<Guest Email>", "GuestPhone":"<Guest phone #>", "Start":"<Start Date>", "End":"End Date"}' -H "Content-Type: application/json" -X POST http://localhost:8000/reservations`
### Get Reservations
Get reservations for a specific property  
`curl http://localhost:8000/reservations/<AuthToken>/<Property ID>`  
### Delete Reservation
Delete/cancel reservation  
`curl -d '{"AuthToken":"<AuthToken>", "ReservationId":"<Reservation ID>"}' -H "Content-Type: application/json" -X POST http://localhost:8000/reservations/delete/`
### CheckIn
CheckIn to a reservation
- Updates 'checkIn' field with the current time
- Reservation cannot be already checked in

`curl -d '{"AuthToken":"<AuthToken>", "ReservationId":"<Reservation ID>"}' -H "Content-Type: application/json" -X POST http://localhost:8000/reservations/checkIn/`
### CheckOut
CheckOut of a reservation
- Updates 'checkOut' field with the current time
- Reservatin must already be checked in
- Reservation cannot be already checked out

`curl -d '{"AuthToken":"<AuthToken>", "ReservationId":"<Reservation ID>"}' -H "Content-Type: application/json" -X POST http://localhost:8000/reservations/checkOut/`

## Discussion points
1. Error handling
  - Errors would be thrown from the 'repositories' and caught by the controllers, which would return a relevant message to the caller for that error
3. Input validation/sanitization
  - Inputs are not currently validated or sanitized by the application. All inputs should have their types validated and sanitized for irrelevent characters to avoid injection or other vulnerabilities
4. Schema changes
  - The DB schema was built with models via TypeORM. Migrations can be built with TypeORM to update the schmema safety for future changes
5. Testing
  - Unit tests could be built with jest to validate the code functionality. These tests could be required to run when committing to the repo to prevent broken code
6. Endpoint versioning
  - For future endpoint versions, an API subpath could be setup (ie. /v2/ to maintain the current endpoints while allowing schema, return type and other changes to the API. Good code organization would put all the current endpoints under the path "/v1/..." so these are more clearly labeled in the future

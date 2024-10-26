import { getRepository } from "typeorm";
import { Manager, Property } from "../models";

export interface IPropertyPayload {
    AuthToken: string;
    name: string;
}

//Get properties owned by this manager
export const getPropertys = async (AuthToken: string): Promise<Property[] | null> => {
    //Get manager from authToken. Error if authToken is invalid
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            AuthToken: AuthToken 
        }
    });
    if (!manager) return null;
    // Get properties owned by manager
    const propertyRepository = getRepository(Property);
    const propertys = await propertyRepository.find({ 
        where: {
            managerId: manager["id"],
        },
    });
    if (!propertys) return null;
    return propertys;
  };

//Create a property owned by this manager
export const createProperty = async (payload: IPropertyPayload): Promise<Property | null> => {
    //Get manager from authToken. Error if authToken is invalid
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            AuthToken: payload["AuthToken"],
        }
    });
    if (!manager) return null;
    // create a property owned by this manager
    const propertyRepository = getRepository(Property);
    let property = new Property();
    property["managerId"] = manager["id"];
    property["name"] = payload["name"];
    return propertyRepository.save({
    ...property,
    });
};
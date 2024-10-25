import { getRepository } from "typeorm";
import { Manager, Property } from "../models";

export interface IPropertyPayload {
    AuthToken: string;
    name: string;
}

export const getPropertys = async (AuthToken: string): Promise<Property[] | null> => {
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            AuthToken: AuthToken 
        }
    });
    if (!manager) return null;
    const propertyRepository = getRepository(Property);
    const propertys = await propertyRepository.find({ 
        where: {
            managerId: manager["id"],
        },
    });
    if (!propertys) return null;
    return propertys;
  };

export const createProperty = async (payload: IPropertyPayload): Promise<Property | null> => {
    const managerRepository = getRepository(Manager);
    const manager = await managerRepository.findOne({ 
        where: {
            AuthToken: payload["AuthToken"],
        }
    });
    if (!manager) return null;
    const propertyRepository = getRepository(Property);
    let property = new Property();
    property["managerId"] = manager["id"];
    property["name"] = payload["name"];
    return propertyRepository.save({
    ...property,
    });
};
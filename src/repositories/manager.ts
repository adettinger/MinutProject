import { getRepository } from "typeorm";
import { Manager } from "../models";
import { v4 as uuidv4 } from "uuid";

export const createManager = async (): Promise<Manager> => {
  const managerRepository = getRepository(Manager);
  let manager = new Manager();
  manager["AuthToken"] = uuidv4();
  return managerRepository.save({
    ...manager,
  });
};

export const getManager = async (AuthToken: string): Promise<Manager | null> => {
  const managerRepository = getRepository(Manager);
  const manager = await managerRepository.findOne({ 
    where: {
        AuthToken: AuthToken 
    }
  });
  if (!manager) return null;
  return manager;
};

// In a production environment, this endpoint would not exist. However, this endpoint makes testing possible without needing to save data
export const getAllManagers = async (): Promise<Manager[] | null> => {
  const managerRepository = getRepository(Manager);
  const managers = await managerRepository.find({});
  if (!managers) return null;
  return managers;
};
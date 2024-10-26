import { getRepository } from "typeorm";
import { Manager } from "../models";
import { v4 as uuidv4 } from "uuid";

//Create a manager and return the object
//Raw manager ID would not be shared in production application
export const createManager = async (): Promise<Manager> => {
  const managerRepository = getRepository(Manager);
  let manager = new Manager();
  // uuid is not generally considered 'secure', but for this demo project it is sufficient
  // In future could be replaced with true IAM
  manager["AuthToken"] = uuidv4();
  return managerRepository.save({
    ...manager,
  });
};

//Get the manager object for the authToken
//Helpful endpoint in testing, but not useful to a user
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

// Get all manager objects, including authTokens
// In a production environment, this endpoint would not exist. However, this endpoint makes testing possible without needing to save/remember data
export const getAllManagers = async (): Promise<Manager[] | null> => {
  const managerRepository = getRepository(Manager);
  const managers = await managerRepository.find({});
  if (!managers) return null;
  return managers;
};
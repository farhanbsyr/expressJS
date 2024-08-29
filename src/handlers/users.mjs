import { mockData } from "../utils/constans.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPasword } from "../utils/helper.mjs";
import { User } from "../mongoose/schema/user.mjs";

export const getUserByIdHandler = (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockData[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
};

export const createUserHandler = async (request, response) => {
  const result = validationResult(request);
  if (!result.isEmpty()) return response.status(400).send(result.array());

  const data = matchedData(request);
  data.password = hashPasword(data.password);
  const newUser = new User(data);
  try {
    const savedUser = await newUser.save();
    return response.status(201).send(savedUser);
  } catch (err) {
    return response.sendStatus(400);
  }
};

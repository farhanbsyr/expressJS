import { Router } from "express";
import express, { request, response } from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { creatUserValidationSchemas } from "../utils/validationSchemas.mjs";
import { mockData } from "../utils/constans.mjs";
import { resolvebyUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schema/user.mjs";
import { hashPasword } from "../utils/helper.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";
const router = Router();

// get request
router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Mush be string")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ max: 10, min: 3 })
    .withMessage("Must be at least 3-10 character"),
  (request, response) => {
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    const result = validationResult(request);
    const {
      query: { filter, value },
    } = request;
    if (!filter && !value) return response.send(mockData);
    if (filter && value)
      return response.send(
        mockData.filter((user) => user[filter].includes(value))
      );
    return response.send(mockData);
  }
);

// post
router.post(
  "/api/users",
  checkSchema(creatUserValidationSchemas),
  createUserHandler
);

// query params
router.get("/api/users/:id", resolvebyUserId, getUserByIdHandler);

// put
router.put("/api/users/:id", resolvebyUserId, (request, response) => {
  const { body, findUser } = request;
  mockData[findUser] = { id: mockData[findUser].id, ...body };
  return response.sendStatus(200);
});

// patch
router.patch("/api/users/:id", resolvebyUserId, (request, response) => {
  const { body, findUser } = request;
  mockData[findUser] = { ...mockData[findUser], ...body };
  return response.sendStatus(200);
});

// delete
router.delete("/api/users/:id", resolvebyUserId, (request, response) => {
  const { findUser } = request;
  mockData.splice(findUser, 1);
  return response.sendStatus(200);
});

export default router;

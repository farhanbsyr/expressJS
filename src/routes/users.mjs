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
    const result = validationResult(request);
    console.log(result);
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
  // [ diganti dengan schema
  //   body("userName")
  //     .notEmpty()
  //     .withMessage("username cannot be empty")
  //     .isLength({ min: 5, max: 35 })
  //     .withMessage("username must be at 5-35 charachter"),
  //   body("displayName")
  //     .notEmpty()
  //     .withMessage("displayName cannot be empty")
  //     .isLength({ min: 5, max: 35 })
  //     .withMessage("displayName must be at 5-35 charachter"),
  // ],
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    const newUser = { id: mockData[mockData.length - 1].id + 1, ...data };
    mockData.push(newUser);
    return response.status(201).send(newUser);
  }
);

// query params
router.get("/api/users/:id", (request, response) => {
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId)) {
    return response.status(400).send(`Bad Request : your id not valid`);
  }
  const findUser = mockData.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

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

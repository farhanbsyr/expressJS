import { mockData } from "./constans.mjs";

export const resolvebyUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUser = mockData.findIndex((user) => user.id === parsedId);
  if (findUser === -1) return response.sendStatus(404);
  request.findUser = findUser;
  next();
};

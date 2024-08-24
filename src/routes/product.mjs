import { request, response, Router } from "express";

const router = Router();

const productData = [
  {
    chicken: 40000,
    telur: 32000,
  },
];

// unsigned cookies
router.get("/api/product", (request, response) => {
  console.log(request.signedCookies);
  console.log(request.headers.cookie);
  if (request.signedCookies && request.signedCookies.hello === "world")
    return response.status(200).send(productData);

  return response.status(403).send("Sorry your need right cookie");
});

export default router;

import express, { request, response } from "express";
import routes from "./routes/routes.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockData } from "./utils/constans.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";
// fase pertama setup PORT
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, (request, response) => {
  console.log(`Running on port ${PORT}`);
});
// middleWare untuk ketika POST methode akan membuat data json  bisa terbaca
app.use(express.json());
app.use(cookieParser("hello"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
// middleware adalah sebuah function yang memiliki parameter request, response, next. dan bisa dipakai disemua route atapun 1 route
// next berfungsi untuk membuat kita dapat menjalankan middleware selanjutnya

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
  console.log(`inside /auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  return request.user
    ? response.status(200).send(request.user)
    : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendstatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

// unsigned cookie && signedCookie
// session part 1 && 2
// app.get("/", (req, res) => {
//   console.log(req.session);
//   console.log(req.session.id);
//   req.session.visited = true;
//   res.cookie("hello", "world", { maxAge: 100000, signed: true });
//   res.status(200).send({ msg: "Hello World" });
// });

// app.post("/api/auth", (request, response) => {
//   const {
//     body: { userName, password },
//   } = request;
//   const findUser = mockData.find((user) => user.userName === userName);
//   if (!findUser || findUser.password !== password)
//     return response.status(401).send({ msg: "BadCredentials" });

//   request.session.user = findUser;
//   return response.status(200).send(findUser);
// });

// app.get("/api/auth/status", (request, response) => {
//   request.sessionStore.get(request.sessionID, (err, session) => {
//     console.log(session);
//   });
//   return request.session.user
//     ? response.status(200).send(request.session.user)
//     : response.status(401).send({ msg: "Not Authenticated" });
// });

// app.post("/api/cart", (request, response) => {
//   if (!request.session.user) return response.sendStatus(401);
//   const { body: item } = request;

//   const { cart } = request.session;
//   if (cart) {
//     cart.push(item);
//   } else {
//     request.session.cart = [item];
//   }
//   return response.status(201).send(item);
// });

// app.get("/api/cart", (request, response) => {
//   if (!request.session.user) return response.sendStatus(401);
//   return response.send(request.session.cart ?? []);
// });

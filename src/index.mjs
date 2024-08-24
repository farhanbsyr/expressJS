import express, { request, response } from "express";
import routes from "./routes/routes.mjs";
import cookieParser from "cookie-parser";
// fase pertama setup PORT
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, (request, response) => {
  console.log(`Running on port ${PORT}`);
});

// middleWare untuk ketika POST methode akan membuat data json  bisa terbaca
app.use(express.json());
app.use(cookieParser("hello"));
app.use(routes);
// middleware adalah sebuah function yang memiliki parameter request, response, next. dan bisa dipakai disemua route atapun 1 route
// next berfungsi untuk membuat kita dapat menjalankan middleware selanjutnya

// unsigned cookie && signedCookie
app.get("/", (req, res) => {
  res.cookie("hello", "world", { maxAge: 100000, signed: true });
  res.status(200).send({ msg: "Hello World" });
});

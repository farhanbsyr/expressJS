import express, { request, response } from "express";
import userRouter from "./routes/users.mjs";
// fase pertama setup PORT
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, (request, response) => {
  console.log(`Running on port ${PORT}`);
});

// middleWare untuk ketika POST methode akan membuat data json  bisa terbaca
app.use(express.json());
app.use(userRouter);
// middleware adalah sebuah function yang memiliki parameter request, response, next. dan bisa dipakai disemua route atapun 1 route
// next berfungsi untuk membuat kita dapat menjalankan middleware selanjutnya

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Hello World" });
});

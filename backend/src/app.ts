import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { NotFoundError } from "./errors";
import expressJSDocSwagger from "express-jsdoc-swagger";
import { options } from "../docs/options";
import { env } from "./config";

import { errorHandler } from "./middlewares";
import { twoFactorRouter } from "./routes/2fa.routes";
import { authRouter, GoogleStrategy } from "./routes/auth.routes";
import { passwordRouter } from "./routes/password.routes";
import { currentUser } from "./middlewares/current-user";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cors({
    origin: env.CLIENT_URL, // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
passport.use(GoogleStrategy);
if (env.NODE_ENV !== "test") {
  expressJSDocSwagger(app)(options);
}
app.use(cookieParser());
app.use(currentUser);
app.use("/2fa", twoFactorRouter);
app.use("/auth", authRouter);
app.use("/password", passwordRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

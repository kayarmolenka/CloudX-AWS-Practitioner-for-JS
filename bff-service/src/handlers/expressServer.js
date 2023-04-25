import express from "express";

export const expressServer = async (event, context, callback) => {
  try {
    const app = express();

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    callback(error);
  }
};

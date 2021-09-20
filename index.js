const express = require("express");
const { route } = require("express/lib/application");
const app = express();
const routes = require("./routes");

const port = 3000;
app.use("/api/v1", routes);

app.listen(port, () => {
  console.log("Server is running at" + port);
});

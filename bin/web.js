const app = require("express")();
const geoip = require("geoip-lite");
const http = require("http").createServer(app);
const model = require("../model");

app.set("view engine", "pug");
app.use(require("express").static("static"));
app.use(require("morgan")("tiny"));
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("body-parser").json());

app.get("/", async (req, res) => {
  const remoteIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const location = geoip.lookup(remoteIp);

  // load the cases
  const cases = await model.getCases();

  // generate the map markers
  const markersScript =
    "const raw_markers = " +
    JSON.stringify(
      cases.map((aCase) => {
        return {
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          infobox: "Age: " + aCase.age + " Symptoms: " + aCase.symptoms,
          lat: aCase.location.ll[0],
          lng: aCase.location.ll[1],
        };
      })
    ) +
    ";";

  console.log(location);
  res.render("index", {
    title: "CoronaTracker",
    message: "Reported Cases",
    location: location,
    markersScript: markersScript,
    cases: cases,
  });
});

app.get("/resources", (req, res) => {
  res.render("resources", { title: "CoronaTracker" });
});

app.get("/tos", (req, res) => {
  res.render("tos", { title: "CoronaTracker" });
});

app.post("/api/submit-report", async (req, res) => {
  const remoteIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const location = geoip.lookup(remoteIp);
  console.log("REQUEST FROM LOCATION: " + JSON.stringify(location, false, 2));

  if (!location)
    return res.end(
      "Unfortunately your location could not be verified from your IP address."
    );

  if (
    !req.body["location-city"] ||
    !req.body["location-region"] ||
    !req.body["location-country"] ||
    !req.body["age"] ||
    !req.body["testingstatus"] ||
    !req.body["contactstatus"] ||
    !req.body["symptoms"]
  );

  const data = Object.assign(
    {
      ipAddress: remoteIp,
      location: location,
    },
    req.body
  );

  console.log("INSERTING NEW FORM DATA: " + JSON.stringify(data, false, 2));

  try {
    await model.insertOrUpdateCase(data);
  } catch (e) {
    console.log(e);
    return res.end(
      "ERROR: invalid form data -- please return to the main page and try again"
    );
  }
  console.log("inserted data OK");

  res.redirect("/");
});

(async () => {
  http.listen(5000, () => {
    console.log("listening on port :5000");
  });
})();

const debug = require("debug")("model");
const db = require("./db");
const geoip = require("geoip-lite");

exports.insertOrUpdateCase = async (info) => {
  const existingCase = await db("cases")
    .where("ipAddress", info.ipAddress)
    .first();

  if (existingCase) {
    await db("cases")
      .where("ipAddress", info.ipAddress)
      .del();
  }

  console.log("LOCATION IS NULL? ", info.location);

  await db("cases").insert({
    ipAddress: info.ipAddress,
    country: info["location-country"],
    city: info["location-city"],
    region: info["location-region"],
    location: JSON.stringify(info.location),
    age: parseInt(info.age),
    symptoms: JSON.stringify(info.symptoms),
    tested: info.testingstatus,
    incontact: info.contactstatus,
  });
};

exports.getCases = async () => {
  return await db.select().from("cases");
};

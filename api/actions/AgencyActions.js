const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;

const { ObjectId } = require("mongodb");
const url =
  "mongodb+srv://allwynm:Welcome%40123@allwyncluster-00ui1.mongodb.net/test?authSource=admin&replicaSet=AllwynCluster-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const dao = {
  getagencies: function (req, res, err) {
    try {
      return new Promise(function (resolve, reject) {
        mongoClient.connect(url, async function (err, server) {
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            console.log("request", req, res);
            const dbo = server.db("ShopDB");

            dbo
              .collection("Agency")
              .aggregate([
                {
                  $lookup: {
                    from: "AgencyDay",
                    localField: "_id",
                    foreignField: "agency_id",
                    as: "agencyday",
                  },
                },
                {
                  $project: {
                    name: 1,
                    executive_name: 1,
                    phone_number: 1,
                    isActive: 1,
                    "agencyday.order_day": 1,
                    "agencyday.delivery_day": 1,
                  },
                },
              ])
              .toArray(async (err, res) => {
                console.log("got data");
                console.log(res);
                return await resolve(res);
              });
          }
        });
      });
    } catch (ex) {
      return reject(ex);
    }
  },

  upsertagency: function (req, res, err) {
    try {
      return new Promise(function (resolve, reject) {
        mongoClient.connect(url, async function (err, server) {
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            const dbo = server.db("ShopDB");
            console.log("connect to shop db");
            console.log(req.body);
            if (req.body.AgencyID == null) {
              const data = {
                name: req.body.Name,
                executive_name: req.body.ExecutiveName,
                phone_number: req.body.PhoneNumber,
                isActive: req.body.IsActive,
              };
              console.log("sending data", data);
              dbo.collection("Agency").insertOne(data, (err, res) => {
                if (err) {
                  console.log(err);
                  return reject(err);
                } else {
                  console.log("inserted", res);
                  const AgencyDayData = {
                    agency_id: data._id,
                    order_day: req.body.OrderDay,
                    delivery_day: req.body.DeliveryDay,
                  };
                  console.log("sending data", AgencyDayData);
                  dbo
                    .collection("AgencyDay")
                    .insertOne(AgencyDayData, (err, res) => {
                      if (err) {
                        console.log(err);
                        return reject(err);
                      } else {
                        console.log("inserted", res);
                        return resolve("Agency inserted successfully.");
                      }
                    });
                }
              });
            } else {
              var myquery = { _id: ObjectId(req.body.AgencyID) };
              var agencyDayQuery = { agency_id: ObjectId(req.body.AgencyID) };
              var agencyNewValues = {
                $set: {
                  name: req.body.Name,
                  executive_name: req.body.ExecutiveName,
                  phone_number: req.body.PhoneNumber,
                  isActive: req.body.IsActive,
                },
              };
              var agencyDayNewValues = {
                $set: {
                  order_day: req.body.OrderDay,
                  delivery_day: req.body.DeliveryDay,
                },
              };
              console.log(myquery, agencyNewValues, agencyDayNewValues);
              dbo
                .collection("Agency")
                .updateOne(myquery, agencyNewValues, (err, res) => {
                  if (err) {
                    console.log(err);
                    return reject(err);
                  } else {
                    console.log("updated", res);
                  }
                });
              dbo
                .collection("AgencyDay")
                .updateOne(agencyDayQuery, agencyDayNewValues, (err, res) => {
                  if (err) {
                    console.log(err);
                    return reject(err);
                  } else {
                    console.log("updated", res);
                  }
                });
              return resolve("Updated Successfully");
            }
          }
        });
      });
    } catch (ex) {}
  },
};

module.exports = dao;

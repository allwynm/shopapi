const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;

const { ObjectId } = require("mongodb");
const url =
  "mongodb+srv://allwynm:Welcome%40123@allwyncluster-00ui1.mongodb.net/test?authSource=admin&replicaSet=AllwynCluster-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const dao = {
  //Category
  getcategories: function (req, res, err) {
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
              .collection("Category")
              .find({})
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

  upsertcategory: function (req, res, err) {
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
            if (req.body.CategoryID == null) {
              const data = {
                name: req.body.Name,
                isActive: req.body.IsActive,
                create_date: new Date(),
              };
              console.log("sending data", data);
              dbo.collection("Category").insertOne(data, (err, res) => {
                if (err) {
                  console.log(err);
                  return reject(err);
                } else {
                  console.log("inserted", res);
                  return resolve("Category inserted successfully.");
                }
              });
            } else {
              var myquery = { _id: ObjectId(req.body.CategoryID) };
              var newValues = {
                $set: {
                  name: req.body.Name,
                  isActive: req.body.IsActive,
                },
              };
              console.log(myquery, newValues);
              dbo
                .collection("Agency")
                .updateOne(myquery, newValues, (err, res) => {
                  if (err) {
                    console.log(err);
                    return reject(err);
                  } else {
                    console.log("updated", res);
                    return resolve("Updated Successfully");
                  }
                });
            }
          }
        });
      });
    } catch (ex) {}
  },

  //Product
  getproducts: function (req, res, err) {
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
              .collection("Product")
              .find({})
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

  getproduct: function (req, res, err) {
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
              .collection("Product")
              .aggregate([
                {
                  $lookup: {
                    from: "SkuProduct",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "skuProduct",
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

  upsertproduct: function (req, res, err) {
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
            if (req.body.ProductID == null) {
              const data = {
                name: req.body.Name,
                brand: req.body.Brand,
                category_id: req.body.CategoryID,
                isActive: req.body.IsActive,
              };
              console.log("sending data", data);
              dbo.collection("Product").insertOne(data, (err, res) => {
                if (err) {
                  console.log(err);
                  return reject(err);
                } else {
                  console.log("inserted", res);
                }
              });
            } else {
              var myquery = { _id: ObjectId(req.body.ProductID) };
              var newValues = {
                $set: {
                  name: req.body.Name,
                  brand: req.body.Brand,
                  category_id: req.body.CategoryID,
                  isActive: req.body.IsActive,
                },
              };
              console.log(myquery, newValues);
              dbo
                .collection("Product")
                .updateOne(myquery, newValues, (err, res) => {
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

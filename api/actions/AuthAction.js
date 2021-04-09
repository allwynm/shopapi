const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;
const random = require("./common");
const { ObjectId } = require("mongodb");
const url =
  "mongodb+srv://allwynm:hiQBG6aYB8FeaAAs@allwyncluster-00ui1.mongodb.net/test?retryWrites=true&w=majority";

const dao = {
  login: function (req, res, err) {
    try {
      return new Promise(function (resolve, reject) {
        mongoClient.connect(url, async function (err, server) {
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            console.log("connect to secret messagedb");
            console.log("request", req, res);
            const dbo = server.db("secret_message");
            const query = { name: req.query.name, pin: req.query.pin };
            console.log(query);
            dbo
              .collection("user")
              .find(query)
              .toArray(async (err, res) => {
                if (err) {
                  console.log("error at finding query");
                } else {
                  console.log("got data");
                  console.log(res);

                  if (res.length > 0) {
                    dbo.collection("message");
                    dao
                      .getMessages(res[0]._id.toString())
                      .then(function (result) {
                        console.log("adfasdfasfasdfdff", result);
                        let data = {
                          userId: res[0]._id,
                          // url: req,
                          messageList: result,
                        };
                        return resolve(data);
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  } else {
                    return reject("Invalid credentials.");
                  }
                }
              });
          }
        });
      });
    } catch (ex) {}
  },

  register: function (req, res, err) {
    try {
      return new Promise(function (resolve, reject) {
        mongoClient.connect(url, async function (err, server) {
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            const dbo = server.db("secret_message");
            console.log("connect to secret messagedb");

            const query = { name: req.body.name };
            console.log(query);
            dbo
              .collection("user")
              .find(query)
              .toArray(async (err, res) => {
                if (res.length > 0) {
                  return reject("user already exist");
                } else {
                  const data = {
                    name: req.body.name,
                    pin: req.body.pin,
                    createDate: new Date(),
                  };
                  console.log("data sending", data);
                  dbo.collection("user").insertOne(data, (err, res) => {
                    if (err) {
                      console.log(err);
                      return reject(err);
                    } else {
                      console.log("inserted", res);
                      let data = {
                        userID: res.insertedId,
                      };
                      return resolve(data);
                    }
                  });
                }
              });
          }
        });
      });
    } catch (ex) {}
  },

  getMessages: async (userID) => {
    try {
      return new Promise(function (resolve, reject) {
        //connect to db
        mongoClient.connect(url, async (err, server) => {
          const dbo = server.db("secret_message");
          const query = { userID: userID };
          await dbo
            .collection("message")
            .find(query)
            .toArray((err, res) => {
              server.close();
              return resolve(res);
            });
        });
      });
    } catch (ex) {}
  },

  sendmessage: function (req, res, err) {
    try {
      return new Promise(function (resolve, reject) {
        mongoClient.connect(url, async function (err, server) {
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            const dbo = server.db("secret_message");
            console.log("connect to secret messagedb");

            const data = {
              userID: req.body.userID,
              text: req.body.message,
              createDate: new Date(),
            };
            console.log("data sending", data);
            dbo.collection("message").insertOne(data, (err, res) => {
              if (err) {
                console.log(err);
                return reject(err);
              } else {
                console.log("inserted", res);
                return resolve("Message sent successfully.");
              }
            });
          }
        });
      });
    } catch (ex) {}
  },

  deleteMessage: function (req, res, err) {
    try {
      return new Promise((resolve, reject) => {
        mongoClient.connect(url, async function (err, server) {
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            const dbo = server.db("secret_message");
            console.log("connect to secret messagedb");

            var myquery = { _id: ObjectId(req.query.messageID) };
            dbo.collection("message").deleteOne(myquery, (err, res) => {
              if (err) {
                console.log(err);
                return reject(err);
              } else {
                console.log("deleted", res);
                return resolve("Message deleted successfully");
              }
            });
          }
        });
      });
    } catch (ex) {}
  },
};

module.exports = dao;

const express = require("express");
const router = express.Router();
const dao = require("../actions/AgencyActions");

router.get("/getagencies", function (req, res, next) {
  console.log("getagencies called");
  const login = dao.getagencies(req, res, next);
  login.then(
    function (result) {
      console.log("controler response", result);
      return res.status(200).json({ status: "SUCCESS", response: result });
    },
    function (error) {
      console.log("login controller error occured");
      return res.status(200).json({ status: "ERROR", message: error });
    }
  );
});

router.post("/upsertagency", function (req, res, next) {
  if (req.body == null) {
    return res
      .status(200)
      .json({ status: "ERROR", message: "Body cannot be null" });
  } else {
    dao
      .upsertagency(req, res, next)
      .then(
        function (result) {
          return res.status(200).json({ status: "SUCCESS", message: result });
        },
        (exception) => {
          console.log(exception);
          return res.status(200).json({
            status: "EXCEPTION",
            message: "Issue in sending message, please try again later",
          });
        }
      )
      .catch((error) => {
        return res.status(200).json({ status: "ERROR", message: error });
      });
  }
});

module.exports = router;

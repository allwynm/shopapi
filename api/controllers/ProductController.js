const express = require("express");
const router = express.Router();
const dao = require("../actions/ProductActions");

// Category
router.get("/getcategories", function (req, res, next) {
  console.log("getcategories called");
  const category = dao.getcategories(req, res, next);
  category.then(
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

router.post("/upsertcategory", function (req, res, next) {
  if (req.body == null) {
    return res
      .status(200)
      .json({ status: "ERROR", message: "Body cannot be null" });
  } else {
    dao
      .upsertcategory(req, res, next)
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

// Product
router.get("/getproducts", function (req, res, next) {
  console.log("getproducts called");
  const products = dao.getproducts(req, res, next);
  products.then(
    function (result) {
      console.log("controler response", result);
      return res.status(200).json({ status: "SUCCESS", response: result });
    },
    function (error) {
      console.log("product controller error occured");
      return res.status(200).json({ status: "ERROR", message: error });
    }
  );
});

router.get("/getproduct", function (req, res, next) {
  console.log("getproduct called");
  const product = dao.getproduct(req, res, next);
  product.then(
    function (result) {
      console.log("controler response", result);
      return res.status(200).json({ status: "SUCCESS", response: result });
    },
    function (error) {
      console.log("product controller error occured");
      return res.status(200).json({ status: "ERROR", message: error });
    }
  );
});

router.post("/upsertproduct", function (req, res, next) {
  if (req.body == null) {
    return res
      .status(200)
      .json({ status: "ERROR", message: "Body cannot be null" });
  } else {
    dao
      .upsertproduct(req, res, next)
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

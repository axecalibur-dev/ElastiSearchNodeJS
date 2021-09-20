const express = require("express");
const router = express.Router();
const elastic = require("elasticsearch");
const bodyParser = require("body-parser").json();

const elasticClient = elastic.Client({
  host: "localhost:3000",
});

router.get("/", (req, res) => {
  return res.json({
    message: "Server running",
  });
});

router.use((req, res, next) => {
  elasticClient
    .index({
      index: "logs",
      body: {
        url: req.url,
        method: req.method,
      },
    })
    .then((res) => {
      console.lo("Logs have been indexed");
    })
    .catch((err) => {
      console.log("Error generated" + err);
    });

  next();
});

router.post("/products", bodyParser, (req, res) => {
  elasticClient
    .index({
      index: "products",
      body: req.body,
    })
    .then((resp) => {
      return res.status(200).json({
        msg: "Product Indexed",
      });
    })
    .catch((err) => {
      return res.json(500).json({
        msg: "Error",
        err,
      });
    });
});

router.get("/products/:id", (req, res) => {
  let query = {
    index: "products",
    id: req.params.id,
  };

  elasticClient
    .get(query)
    .then((resp) => {
      if (!resp) {
        return res.status(400).json({
          product: resp,
        });
      }

      return res.status(200).json({
        product: resp,
      });
    })
    .catch((err) => {
      return res.json(500).json({
        msg: "Error",
        err,
      });
    });
});

router.put("/products/:id", bodyParser, (req, res) => {
  elasticClient
    .update({
      index: "products",
      id: req.params.id,
      body: { doc: req.body },
    })
    .then((resp) => {
      return res.status(200).json({
        msg: "Product Updated",
      });
    })
    .catch((err) => {
      return res.json(500).json({
        msg: "Error",
        err,
      });
    });
});

router.delete("/products/:id", (req, res) => {
  elasticClient
    .delete({
      index: "products",
      id: req.params.id,
    })
    .then((resp) => {
      return res.status(200).json({
        msg: "Product Deleted",
      });
    })
    .catch((err) => {
      return res.json(500).json({
        msg: "Error",
        err,
      });
    });
});

router.get("/products", (req, res) => {
  let query = {
    index: "products",
  };
  if (req.query.search) query.q = `*${req.query.product}*`;
  elasticClient
    .search(query)
    .then((resp) => {
      if (!resp) {
        return res.status(400).json({
          product: resp.hits.hits,
        });
      }

      return res.status(200).json({
        product: resp,
      });
    })
    .catch((err) => {
      return res.json(500).json({
        msg: "Error",
        err,
      });
    });
});

module.exports = router;

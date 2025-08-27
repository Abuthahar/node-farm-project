const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

const replaceTemplate = require("./module/replaceTemplate");

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// Server

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/template/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // const pathName = req.url;

  // Product Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    // console.log(cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    console.log(query);

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(output);
    // res.end("This is the product");
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
  // res.end("Hello from the server");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});

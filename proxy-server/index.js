import dotenv from "dotenv";
dotenv.config()
import express from "express"
import cors from "cors";
import helmet from "helmet";
import axios from "axios";

const app = express()
app.use(cors())
app.use(helmet())

const getPaginatedRecords = (items, pageSize, page) => {

  //Set the boundaries on each pagination request (e.g. PAGE_SIZE and what page)
  page--
  let loopStart = pageSize * page;
  let loopEnd = loopStart + pageSize;

  //No more records to process
  if (loopStart >= items.length) return {}

  //if you are at the end change the endLoop value to that numbeer
  loopEnd = loopEnd <= items.length ? loopEnd : items.length

  //Grab next set, set the has more flag
  let paginatedItems = items.slice(loopStart, loopEnd)
  const numLeft = items.length - loopEnd
  const hasMore = numLeft > 0

  return {
    info: {
      conversations: items.length,
      page: page,
      results: pageSize,
      hasMoreRecords: hasMore,
      remainingConverations: numLeft
    },
    results: paginatedItems,
  }
}


app.use("/api/conversations", async (req, res) => {
  try {
    const endPoint = `https://randomuser.me/api/?seed=joed&results=200&nat=us`
    const results = await axios.get(endPoint);
    const pageSize = parseInt(req.query.pagesize)
    const page = parseInt(req.query.page)
    const paginatedRecords = getPaginatedRecords(results.data.results, pageSize, page)
    if (paginatedRecords?.results && paginatedRecords.results.length > 0) {
      return res.send(paginatedRecords)
    }
  } catch (error) {
    console.log(error)
    res.send([])
  }
});

app.use("/", (req, res) => {
  res.send("hello there")
})

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Listening on port ", port))
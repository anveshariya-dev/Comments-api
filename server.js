const express = require("express");


const app = express();
const PORT = 3000;

async function fetchCommentCount(msid) {
  try {
    const url = `https://plus.timesofindia.com/comments/count/v2?msid=${msid}&appKey=TOI&client=toi`;

    const response = await fetch(url);
    const data = await response.json();

    return {
      msid,
      count: Number(data.cmt_c || 0)
    };
  } catch (error) {
    return {
      msid,
      count: 0
    };
  }
}

app.get("/total-comments", async (req, res) => {
  const msidsParam = req.query.msids;

  if (!msidsParam) {
    return res.status(400).json({ error: "msids query param required" });
  }

  const msids = msidsParam.split(",");

  const results = await Promise.all(msids.map(fetchCommentCount));

  const totalComments = results.reduce((sum, item) => sum + item.count, 0);

  res.json({
    totalComments,
    forumWiseCounts: results
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
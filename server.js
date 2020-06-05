const express = require("express")

const app = new express()

app.use(express.static("out"))

app.listen(8080, () => console.info("Listening!"))

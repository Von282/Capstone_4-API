import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 

app.get("/", (req, res) => {
    //Render ejs file
    res.render("index.ejs", {name: "Waiting...", epi: "Waiting...", similarity: "Waiting...", err: ""});
});

app.post("/", async (req, res) => {
    try {
        //Gets User Input from client
        const imageURL = req.body["imgURL"];

        //Uses the API by sending Users Input
        const apiData = await axios.get(`https://api.trace.moe/search?anilistInfo&url=${imageURL}`);

        //Get the title of anime
        const engTitle = apiData.data.result[0].anilist.title["english"]; //English
        const romTitle = apiData.data.result[0].anilist.title["romaji"]; //Romaji
        const ep = apiData.data.result[0].episode; // Episode

        //Grabs the similarity of the sceenshot with the anime
        const perc = apiData.data.result[0].similarity;
        
        //Turns the similarity to a percentage string
        const similar = Number(perc).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}); 

        //Render ejs file and pass data
        res.render("index.ejs", {name: engTitle, epi: ep, similarity: similar, err: ""});
    }
    catch {
        //Could not find a result
        res.render("index.ejs", {name: "N/A", epi: "N/A", similarity: "N/A", err: "Error: Failed to fetch image"});
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
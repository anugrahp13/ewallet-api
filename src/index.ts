import express from "express";
import accountRoutes from "./routes/account.routes";

const app = express();
app.use(express.json());

app.use("/api", accountRoutes);

app.get("/", (req,res) => {
    res.send("Hello Word form E-wallet API");
});

const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ini server running di port ${PORT}`)
})
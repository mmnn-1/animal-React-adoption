import express from "express";
import { db } from "../db.js";
import { calculateScore } from "../services/Recommendservices.js";

const router = express.Router();

router.post("/recommend", (req, res) => {
  const user = req.body;

  db.query("SELECT * FROM animal_profiles", (err, animals) => {
    if (err) return res.status(500).json(err);

    const results = animals.map(animal => {
      const { score, reasons } = calculateScore(animal, user);
      return { ...animal, score, reasons };
    });

    results.sort((a, b) => b.score - a.score);
    res.json(results.slice(0, 3));
  });
});

export default router;

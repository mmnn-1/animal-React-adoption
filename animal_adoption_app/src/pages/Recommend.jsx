import express from "express";
import { getAllAnimals } from "../db/animals.js";
import { calculateScore } from "../services/recommendService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const formData = req.body;

  try {
    const animals = await getAllAnimals();

    const results = animals.map((animal) => {
      const { score, reasons } = calculateScore(animal, formData);
      return {
        ...animal,
        score,
        reasons,
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "推薦失敗" });
  }
});

export default router;

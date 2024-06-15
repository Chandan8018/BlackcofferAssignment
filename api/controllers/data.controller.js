import fs from "fs";
import Data from "../models/data.model.js";

// Upload data function
export const uploadData = async (req, res, next) => {
  try {
    // Read data from the JSON file
    fs.readFile("data.json", "utf8", async (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to read JSON file", error: err });
      }

      const jsonData = JSON.parse(data).data; // Access the 'data' array

      // Insert data into MongoDB
      await Data.insertMany(jsonData);

      res.status(201).json({ message: "Data uploaded successfully" });
    });
  } catch (error) {
    next(error);
  }
};

// Get data function
export const getData = async (req, res, next) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

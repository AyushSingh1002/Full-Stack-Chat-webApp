import fs from "fs"


export default function AddStickers (req, res) {
    // Use fs.readdir to asynchronously read the directory
    fs.readdir("pics" , (error, data) => {
      if (error) {
        // If there’s an error, return a 500 status code with the error message
        return res.status(500).json({ error: 'Error reading the directory', message: error.message });
      }
      
      // If successful, return the list of files
      res.status(200).json(data.slice(0, 10));
    });
  }
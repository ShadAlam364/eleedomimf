import { MongoClient } from "mongodb";
import archiver from "archiver";
const { MONGODB_URI, DB_NAME, SECRETS } = process.env;

// Function to export all collections
const exportDatabase = async (req, res) => {
// Fetch the MongoDB URI from query or headers
const {secret, dbtype} = req.query;

if (!secret) {
  return res.status(400).json({ message: "Secret Key is required" });
}
if (!dbtype) {
  return res.status(400).json({ message: "DB Format is required" });
}
// Validate the provided Mongo URI against the expected value
if (secret !== SECRETS) {
  return res.status(403).json({ message: "Invalid Secret Key" });
}
  
  const client = new MongoClient(`${MONGODB_URI}/${DB_NAME}`);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // maximum compression
  });
  // Set the response headers to prompt a download
  res.attachment("mongodb.zip");
  archive.pipe(res);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    // Fetch all collection names
    const collections = await db.listCollections().toArray();
    // Export each collection into its own file in the zip
    for (const collection of collections) {
      const collectionName = collection.name;
      const data = await db.collection(collectionName).find({}).toArray();
      // Add the collection data as a file in the zip archive
      const jsonContent = JSON.stringify(data, null, 2);
      archive.append(jsonContent, { name: `${collectionName}.${dbtype}` });
    //  console.log(`Adding collection: ${collectionName}`);
    }
    // Finalize the zip and send the response
    archive.finalize();
  } catch (error) {
    res.status(500).json(error);
  } finally {
    await client.close();
  }
};
export default exportDatabase;


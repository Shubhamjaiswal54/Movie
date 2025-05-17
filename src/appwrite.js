/* eslint-disable no-unused-vars */
import { Client, Databases, ID, Permission, Query, Role } from "appwrite";

// Environment variables - fixed based on the URL in the error message
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID; // This matches the first ID in the error URL
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID; // This matches the second ID in the error URL
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Debug log to verify the IDs
console.log("Using database configuration:", {
  DATABASE_ID,
  COLLECTION_ID,
  PROJECT_ID,
});

const client = new Client();
client.setEndpoint("https://fra.cloud.appwrite.io/v1");
client.setProject(PROJECT_ID); // Make sure this executes

// Add debugging to verify the client configuration
console.log("Client initialized with project ID:", PROJECT_ID);

const database = new Databases(client);

async function updateSearchCount(searchTerm, movie) {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    //count is incresing in the database it's working fine
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      console.log(doc);
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        {
          count: doc.count + 1,
        },
        [Permission.update(Role.any())]
      );

    } else {      
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm :searchTerm,
        count: 1,
        movie_id: movie.id,
        posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      },[Permission.write(Role.any())]);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
}

async function getTrendingMovies() {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
    ]);
    console.log("here are the results");
    console.log(result.documents);
    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}

export default updateSearchCount;
export { getTrendingMovies };

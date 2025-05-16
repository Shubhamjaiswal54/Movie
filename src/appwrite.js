/* eslint-disable no-unused-vars */
import { Client, Databases, ID, Query } from "appwrite";

// Environment variables
const COLLECTION_ID = '68278c530038de60eb11';
const DATABASE_ID = '68278c08001b8fc846c5';
const PROJECT_ID = '68278b56000a7b6f03e2';


const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client); 

async function updateSearchCount(searchTerm, movie) {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      // Fixed typo: "searcTerm" -> "searchTerm"
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      // Fixed: "document" -> "database"
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
}

async function getTrendingMovies() {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);
        return result.documents;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}

export default updateSearchCount;
export { getTrendingMovies };
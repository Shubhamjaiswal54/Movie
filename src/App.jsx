import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import updateSearchCount, { getTrendingMovies } from './appwrite';




function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deboucer, setDeboucer] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(
    () => {
      setDeboucer(searchTerm);
    },
    500,
    [searchTerm]
  );


  async function getMovies(query = '') {
    setLoading(true);
    let url = '';
    { query ? url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1` : url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'; }
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGQ5NTA0ZDYwMTNkOTk3MzFmOWVmZmIwMTA1MTg2NCIsIm5iZiI6MTc0NzQwNTA1NS43OTYsInN1YiI6IjY4Mjc0OGZmNzUyYWJiYmJmODVhNDIyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FseH6B_d0kbxdHVXCUcFJrbi-F7eRx9fN-nXoTaE5AQ'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json(); // <-- correct here
      console.log(result); // Inspect to find correct path to movie list
      setMovies(result.results || []); // Adjust path as needed
      if (query && result.length > 0) {
        await updateSearchCount(query, result.results[0]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadTrendingMOvies() {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(error);

    }
  }



  useEffect(() => {
    getMovies(deboucer);
  }, [deboucer]);

  //dependency is empty only load for the first time 
  useEffect(() => {
    loadTrendingMOvies();
  }, []);

  return (
    <main>
      <div className='pattern'></div>

      <div className='wrapper'>
        <header>
          <img src='/hero.png' alt='hero' />
          <h1 > Find <span className='text-gradient'>Movies</span>  You'all Enjoy without Husstle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))
              }
            </ul>
          </section>
        )}


        <section className='all-movies m-20'>
          {loading ? <p className=' text-white'>Loading...</p> :
            <ul className='text-white'>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          }

        </section>
      </div>

    </main>
  )
}

export default App

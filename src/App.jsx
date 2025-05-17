import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import updateSearchCount, { getTrendingMovies } from './appwrite';


const API_KEY = import.meta.env.VITE_API_KEY;

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
    1000,
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
        Authorization: `Bearer ${API_KEY}`
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json(); // <-- correct here


      setMovies(data.results || []); // Adjust path as needed

      if (query && data.results.length > 0) {
        console.log("here is the list of found movies");
        console.log(query);
        console.log(data.results[0]);
        await updateSearchCount(query, data.results[0]);
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
      const total = await getTrendingMovies();
      setTrendingMovies(total);
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
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.posterUrl} alt={movie.title} />
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

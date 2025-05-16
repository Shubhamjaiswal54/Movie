
const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className='search'>
            <div >
                <img src='search.svg' alt='Search icon' />
                <input type='text' placeholder='Search for Movies, TV Shows, People' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>
    );
}

export default Search

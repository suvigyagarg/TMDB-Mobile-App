export const TMDB_CONFIG ={
    base_url:'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
  }
}



export const fetchMovies =async ({query}:{query :string}) =>{
    const endpoint = query 
    ?`${TMDB_CONFIG.base_url}/search/movie?query=${encodeURIComponent(query)}`
    :`${TMDB_CONFIG.base_url}/discover/movie?page=1&sort_by=popularity.desc`

    const response = await fetch(endpoint , {
        method:'GET',
        headers:TMDB_CONFIG.headers ,       
    });

    if(!response.ok){
        //@ts-ignore
        throw new Error('Failed to fetch movies', response.statusText)
    }

    const data =await response.json();

    return data.results;
}



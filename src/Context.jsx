import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
const AppContext = React.createContext();
const API_KEY = '?api_key=b9b8bd4e47235e621267dc312c170fc3&language=en-US';
const NOW_PLAYING_MOVIES_API_URL = 'https://api.themoviedb.org/3/movie/now_playing?api_key=b9b8bd4e47235e621267dc312c170fc3&language=en-US&page=1';
const POPULAR_MOVIES_API_URL = 'https://api.themoviedb.org/3/movie/upcoming?api_key=b9b8bd4e47235e621267dc312c170fc3&language=en-US&page=1';
const SEARCH_MOVIE_BY_NAME_API_URL = 'https://api.themoviedb.org/3/search/movie?api_key=b9b8bd4e47235e621267dc312c170fc3&language=en-US&page=1&query=';
const TOP_MOVIES_API_URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=b9b8bd4e47235e621267dc312c170fc3&language=en-US&page=1';
const GET_MOVIE_DETAILS_API = 'https://api.themoviedb.org/3/movie/'
const GET_MOVIE_CREDITS_API = '/credits?api_key=b9b8bd4e47235e621267dc312c170fc3&language=en-US';


const AppProvider = ({ children }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [adultFilter, setAdultFilter] = useState(true)
  const [otherSearch, setOtherSearch] = useState('')

  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const adultWords = ['PENIS', 'BLOWJOB', 'ANUS', 'DICK', 'CUNT', 'BOOB', 'FELLATIO', 'ORAL', 'BOOBS', 'VAGINA', 'BOOBS', 'ANAL', 'SEX', 'PORN', 'INTERCOURSE', 'ORAL SEX', 'BLOW JOB', 'BLOWJOB', 'HANDJOB', 'HAND JOB', 'CUM', 'CUMSHOT', 'CUM SHOT', 'BOSOM', 'BLOW JOBS', 'PROFELLA', 'VAGINAL', 'GANGBANG', 'HORNY', 'GIRL SCENES', 'LESBIAN', 'GAY', 'BISEXUAL'];
  const selectMovie = async (id) => {
  let movieDetails;
  let movieCredits;
    if(movies.find((movie) => movie.id === id)){
       try {
         movieDetails = await axios.get(GET_MOVIE_DETAILS_API+id+API_KEY)
         movieCredits = await axios.get(GET_MOVIE_DETAILS_API+id+GET_MOVIE_CREDITS_API)
      }
      catch (error) {
        console.log(error);
      }
    }
    movieDetails.data['cast'] = movieCredits.data.cast.splice(0,5);
    movieDetails.data['crew'] = movieCredits.data.crew.splice(0,10);
    setSelectedMovie(movieDetails.data);
    setShowModal(true);
  }

  const closeModal = () => {
     setShowModal(false);
  }

  const fetchMovies = async (url) => {
    setLoading(true)
    try {
      const { data } = await axios.get(url+'&include_adult='+adultFilter)
      
      if (data.results) {
        console.log('movies == '+data.results);
        if(adultFilter){
          const arr = data.results;
          // const filtered = arr.filter(item => !adultWords.includes(item.title))
          const filtered = arr.filter(item => !adultWords.some(prohb => item.title.toUpperCase().includes(prohb) || item.overview.toUpperCase().includes(prohb))) 
          setMovies(filtered)
        }else{
        setMovies(data.results)
          }
      } else {
        setMovies([])
      }
    
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMovies(NOW_PLAYING_MOVIES_API_URL);
  }, [])

  useEffect(() => {
    if (!searchTerm) return
    fetchMovies(SEARCH_MOVIE_BY_NAME_API_URL + searchTerm)
  }, [searchTerm])

    useEffect(() => {
      console.log(otherSearch)
    if(otherSearch === 'popular'){
    fetchMovies(POPULAR_MOVIES_API_URL)
    }else if (otherSearch === 'top'){
      fetchMovies(TOP_MOVIES_API_URL)
    }
  }, [otherSearch])

  return (<AppContext.Provider value={{ setSearchTerm, movies, loading, setOtherSearch, setAdultFilter, selectMovie, selectedMovie, showModal, closeModal }}>
    {children}
  </AppContext.Provider>)

}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
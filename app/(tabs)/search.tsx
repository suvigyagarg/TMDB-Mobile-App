import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import MovieCard from '@/components/MovieCard'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'


const search = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset
  } = useFetch(() => fetchMovies({
    query: searchQuery
  }), false)

  useEffect(() => {

    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
        if(movies?.length >0 && movies?.[0]){
         await updateSearchCount(searchQuery, movies[0])
      
        }
      } else {
        reset()
      }
    }, 500)

    return () => clearTimeout(timeoutId);
  }, [searchQuery])


  return (
    <View className='flex-1 bg-primary'>
      <Image
        source={images.bg}
        className='flex-1 absolute w-full z-0'
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            {...item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingVertical: 100
        }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20 items-center '>
              <Image
                source={icons.logo}
                className='w-12 h-10'
              />
            </View>
            <View className='my-5'>
              {/* @ts-ignore */}
              <SearchBar
                placeholder='Search Movies ...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size='large'
                color='#0000ff'
                className='my-3'
              />
            )}
            {moviesError && (
              <Text className='text-red-500 px-3 my-3'>
                Error : {moviesError.message}
              </Text>
            )
            }
            {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
              <Text className='text-xl text-white font-bold'>
                Search Results for{' '}
                <Text className='text-accent'>{searchQuery} </Text>
              </Text>

            )}

          </>
        }
        className="px-5"
        scrollEnabled={true}
        ListEmptyComponent={
          !moviesLoading && !moviesError ?(
            <View className='mt-10 px-5'>
            <Text className='text-center text-gray-500'>
             {searchQuery.trim() ? "No Movies found" : "Search for a Movie"}
            </Text>
            </View>
          ):null
        }
      />
    </View>
  )
}

export default search
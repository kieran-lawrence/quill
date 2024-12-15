import { useState } from 'react'
import { User } from '../types'
import { useGetFriendsQuery } from '../store/friend'
import toast from 'react-hot-toast'
/** A hook that returns all of a users friends, and allows for searching of friends */
export const useFriends = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const { data, error, isLoading } = useGetFriendsQuery()

    error && toast.error('Failed to fetch friends')
    /** If there is no `searchTerm`, returns all users friends, else returns friends filtered by `searchTerm` */
    const filteredFriends = data
        ? data.reduce<User[]>((filtered, friend) => {
              if (
                  friend.username
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  friend.email
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  friend.firstName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  friend.lastName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
              ) {
                  filtered.push(friend)
              }
              return filtered
          }, [])
        : []

    /** Searches users friends based on search query */
    const filterFriends = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }
    return {
        friends: filteredFriends,
        searchTerm,
        setSearchTerm,
        filterFriends,
        error,
        isLoading,
    }
}

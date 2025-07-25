'use client'
import React, { useState } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

// Sample static posts list
const posts = [
  { id: 1, title: 'React Native Basics', content: 'Learn the basics of React Native here.' },
  { id: 2, title: 'Expo Router Setup', content: 'How to setup navigation using Expo Router.' },
  { id: 3, title: 'Search Component', content: 'Build a search component using React and state.' },
]

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = (text: string) => {
    setQuery(text)

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(text.toLowerCase()) ||
      post.content.toLowerCase().includes(text.toLowerCase())
    )

    setResults(filtered)
  }

  return (
    <ThemedView className="p-4">
      <ThemedText className="text-xl font-bold mb-2">Search</ThemedText>

      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <ThemedText className="mb-2 font-semibold">
        Search params: <span className="text-gray-600">{query}</span>
      </ThemedText>

      {results.length > 0 ? (
        results.map((post) => (
          <ThemedView key={post.id} className="mb-3 p-3 border rounded shadow-sm">
            <ThemedText className="font-bold text-lg">{post.title}</ThemedText>
            <ThemedText className="text-sm text-gray-700">{post.content}</ThemedText>
          </ThemedView>
        ))
      ) : (
        query && (
          <ThemedText className="text-gray-500">No posts found for "{query}"</ThemedText>
        )
      )}
    </ThemedView>
  )
}

export default Search

import request from '@/utils/request'
import type { Post, Comment, Response } from '@/type'

export const useApi = () => {
  const createPost = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await request.post<Response<Post>>('/posts', formData)
    return response.data
  }

  const getPosts = async () => {
    const response = await request.get('/posts')
    return response.data
  }

  const getPostById = async (id: string) => {
    const response = await request.get(`/posts/${id}`)
    return response.data
  }

  const updatePostById = async (id: string, payload: string) => {
    const response = await request.patch<Response<Post>>(`/posts/${id}`, {
      caption: payload
    })
    return response.data
  }

  const deletePost = () => {}

  const like = () => {}

  const unlike = () => {}

  const addComment = async (id: string, payload: string) => {
    const response = await request.post<Response<Comment>>(`/posts/${id}/comments`, {
      text: payload
    })
    return response.data
  }

  const deleteComment = () => {}

  return {
    createPost,
    getPosts,
    getPostById,
    updatePostById,
    deletePost,
    like,
    unlike,
    addComment,
    deleteComment
  }
}

export default useApi

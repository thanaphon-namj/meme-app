export interface Post {
  id: string
  caption: string | null
  imageUrl: string
  likes: number
  comments: Comment[]
}

export interface Comment {
  id: number
  text: string
}

export type Response<T> = {
  success: boolean
  data: T
}

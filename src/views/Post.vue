<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useApi from '@/composables/useApi'
import { saveFile } from '@/utils/download'
import type { Post, Comment } from '@/type'

import Default from '@/layouts/Default.vue'

const route = useRoute()
const router = useRouter()
const { getPostById, updatePostById, deletePost, like, unlike, addComment, deleteComment } =
  useApi()

const post = ref<Post>({
  id: '',
  caption: null,
  imageUrl: '',
  likes: 0,
  comments: []
})

const caption = ref<string>('')
const comment = ref<string>('')
const isLiked = ref<boolean>(false)

const comments = computed<Comment[]>(() => post.value.comments)

const isCreator = computed<boolean>(() => {
  const p = window.localStorage.getItem('p')
  if (p === null) return false
  const json: string[] = JSON.parse(p)
  return json.some((id) => id === post.value.id)
})

const getPost = async () => {
  const id = route.params.id as string
  const response = await getPostById(id)
  if (response.success === true) {
    post.value = response.data
    checkIsLiked(response.data.id)
  } else {
    router.push({ name: 'notFound' })
  }
}

const onDeletePost = async () => {
  const response = await deletePost(post.value.id)
  if (response.success === true) {
    removeCreator(post.value.id)
    router.push({ name: 'home' })
  }
}

const onAddCaption = async () => {
  const response = await updatePostById(post.value.id, caption.value)
  if (response.success === true) {
    post.value.caption = caption.value
    caption.value = ''
  }
}

const onLike = async () => {
  const response = await like(post.value.id)
  if (response.success === true) {
    post.value.likes = post.value.likes + 1
    setLiked(post.value.id)
    isLiked.value = true
  }
}

const onUnLike = async () => {
  const response = await unlike(post.value.id)
  if (response.success === true) {
    post.value.likes = post.value.likes - 1
    removeLiked(post.value.id)
    isLiked.value = false
  }
}

const onAddComment = async () => {
  const response = await addComment(post.value.id, comment.value)
  if (response.success === true) {
    post.value.comments = [...comments.value, response.data]
    comment.value = ''
  }
}

const onDeleteComment = async (id: number) => {
  const response = await deleteComment(post.value.id, id)
  if (response.success === true) {
    post.value.comments = comments.value.filter((comment) => comment.id !== id)
  }
}

const onDownload = () => {
  saveFile(post.value.imageUrl)
}

const removeCreator = (id: string) => {
  const p = window.localStorage.getItem('p')
  if (p === null) return
  const json: string[] = JSON.parse(p)
  const pid = json.filter((j) => j !== id)
  if (pid.length === 0) {
    window.localStorage.removeItem('p')
  } else {
    window.localStorage.setItem('p', JSON.stringify(pid))
  }
}

const checkIsLiked = (id: string) => {
  const l = window.localStorage.getItem('l')
  if (l === null) {
    isLiked.value = false
  } else {
    const json: string[] = JSON.parse(l)
    isLiked.value = json.some((j) => j === id)
  }
}

const setLiked = (id: string) => {
  const l = window.localStorage.getItem('l')
  const value = [id]
  if (l !== null) {
    const json: string[] = JSON.parse(l)
    value.unshift(...json)
  }
  window.localStorage.setItem('l', JSON.stringify(value))
}

const removeLiked = (id: string) => {
  const l = window.localStorage.getItem('l')
  if (l === null) return
  const json: string[] = JSON.parse(l)
  const pid = json.filter((j) => j !== id)
  if (pid.length === 0) {
    window.localStorage.removeItem('l')
  } else {
    window.localStorage.setItem('l', JSON.stringify(pid))
  }
}

onMounted(getPost)
</script>

<template>
  <Default>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-7">
          <div class="card mb-5">
            <img :src="post.imageUrl" class="card-img-top" />
            <div class="card-body border-0">
              <div v-if="post.caption">{{ post.caption }}</div>
              <input
                v-else
                type="text"
                class="form-control"
                v-model.trim="caption"
                @keyup.enter="onAddCaption"
                placeholder="Caption"
              />
            </div>
          </div>
          <div class="mb-5">
            <h6 class="mb-3">{{ comments.length }} COMMENTS</h6>
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                v-model.trim="comment"
                @keyup.enter="onAddComment"
                placeholder="Add a comment..."
              />
            </div>
            <template v-for="comment in comments" :key="comment.id">
              <div class="p-3 bg-body-secondary rounded mb-2">
                {{ comment.text }}
                <button
                  v-if="isCreator"
                  type="button"
                  class="btn btn-link btn-sm link-danger link-underline-danger"
                  @click="onDeleteComment(comment.id)"
                >
                  Delete
                </button>
              </div>
            </template>
          </div>
        </div>
        <div class="col-3">
          <div class="d-flex flex-column align-items-center bg-body-tertiary border rounded p-2">
            <button
              v-if="isLiked"
              type="button"
              class="btn btn-link btn-lg link-dark link-underline-opacity-0 fs-4 mb-5 w-50"
              title="Like"
              @click="onUnLike"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="bi bi-emoji-sunglasses-fill me-2"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.2 4.2 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A3 3 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515zM4.969 9.75A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"
                />
              </svg>
              {{ post.likes }}
            </button>
            <button
              v-else
              type="button"
              class="btn btn-link btn-lg link-dark link-underline-opacity-0 fs-4 mb-5 w-50"
              title="Like"
              @click="onLike"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="bi bi-emoji-sunglasses me-2"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.968 9.75a.5.5 0 1 0-.866.5A4.5 4.5 0 0 0 8 12.5a4.5 4.5 0 0 0 3.898-2.25.5.5 0 1 0-.866-.5A3.5 3.5 0 0 1 8 11.5a3.5 3.5 0 0 1-3.032-1.75M7 5.116V5a1 1 0 0 0-1-1H3.28a1 1 0 0 0-.97 1.243l.311 1.242A2 2 0 0 0 4.561 8H5a2 2 0 0 0 1.994-1.839A3 3 0 0 1 8 6c.393 0 .74.064 1.006.161A2 2 0 0 0 11 8h.438a2 2 0 0 0 1.94-1.515l.311-1.242A1 1 0 0 0 12.72 4H10a1 1 0 0 0-1 1v.116A4.2 4.2 0 0 0 8 5c-.35 0-.69.04-1 .116"
                />
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0A7 7 0 1 0 1 8a7 7 0 0 0 14 0" />
              </svg>
              {{ post.likes }}
            </button>
            <button
              type="button"
              class="btn btn-link link-dark link-underline-opacity-0 w-50"
              @click="onDownload"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-download me-2"
                viewBox="0 0 16 16"
              >
                <path
                  d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"
                />
                <path
                  d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"
                />
              </svg>
              Download
            </button>
            <button
              v-if="isCreator"
              type="button"
              class="btn btn-link link-danger link-underline-opacity-0 w-50 mt-2"
              @click="onDeletePost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-lg me-2"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
                />
              </svg>
              Delete post
            </button>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

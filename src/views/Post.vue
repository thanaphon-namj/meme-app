<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useApi from '@/composables/api'
import type { Post } from '@/type'

import Default from '@/layouts/Default.vue'

const route = useRoute()
const { getPostById, updatePostById, addComment } = useApi()

const post = ref<Post>({
  id: 0,
  caption: null,
  imageUrl: '',
  likes: 0,
  comments: []
})

const caption = ref('')
const comment = ref('')

const comments = computed(() => post.value.comments)

const getPost = async () => {
  const id = route.params.id as string
  const response = await getPostById(id)
  if (response.success === true) {
    post.value = response.data
  }
}

const onAddCaption = async () => {
  const id = route.params.id as string
  const payload = caption.value
  const response = await updatePostById(id, payload)
  if (response.success === true) {
    post.value.caption = caption.value
    caption.value = ''
  }
}

const onAddComment = async () => {
  const id = route.params.id as string
  const payload = comment.value
  const response = await addComment(id, payload)
  if (response.success === true) {
    post.value.comments = [...comments.value, response.data]
    comment.value = ''
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
                <button type="button" class="btn btn-link btn-sm link-danger link-underline-danger">
                  Delete
                </button>
              </div>
            </template>
          </div>
        </div>
        <div class="col-3">
          <div class="bg-body-tertiary border rounded-3">
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import useApi from '@/composables/api'
import type { Post } from '@/type'

import Default from '@/layouts/Default.vue'

const { getPosts } = useApi()

const posts = ref<Post[]>([])

const getAll = async () => {
  const response = await getPosts()
  if (response.success === true) {
    posts.value = response.data
  }
}

onMounted(getAll)
</script>

<template>
  <Default>
    <div class="container">
      <div class="row row-cols-5">
        <template v-for="post in posts" :key="post.id">
          <div class="col mb-3">
            <RouterLink
              :to="{ name: 'post', params: { id: post.id } }"
              class="link-underline link-underline-opacity-0"
            >
              <div class="card">
                <img :src="post.imageUrl" class="card-img-top" />
                <div v-if="post.caption" class="card-footer border-0">
                  <small class="text-body-secondary">{{ post.caption }}</small>
                </div>
              </div>
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </Default>
</template>

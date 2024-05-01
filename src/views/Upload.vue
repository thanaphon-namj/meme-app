<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useApi from '@/composables/api'

import Logo from '@/components/Logo.vue'

const router = useRouter()
const { createPost } = useApi()

const inputRef = ref<HTMLInputElement>()

const upload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    const file = files[0]
    const response = await createPost(file)
    if (response.success === true) {
      router.push({ name: 'post', params: { id: response.data.id } })
    }
  }
}

const chooseFile = () => {
  inputRef.value?.click()
}
</script>

<template>
  <div>
    <header class="py-3 mb-3">
      <div class="container-fluid">
        <Logo />
      </div>
    </header>
    <div class="container py-5">
      <div class="row py-5">
        <div class="col-4 mx-auto">
          <div class="card text-center">
            <div class="card-body">
              <input ref="inputRef" type="file" accept="image/*" class="d-none" @change="upload" />
              <button type="button" class="btn btn-light" @click="chooseFile">
                Choose Photo/GIF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useApi from '@/composables/useApi'

import Logo from '@/components/Logo.vue'

const router = useRouter()
const { createPost } = useApi()

const isLoading = ref<boolean>(false)
const inputRef = ref<HTMLInputElement>()

const setCreator = (id: string) => {
  const p = window.localStorage.getItem('p')
  const value = [id]
  if (p !== null) {
    const json: string[] = JSON.parse(p)
    value.unshift(...json)
  }
  window.localStorage.setItem('p', JSON.stringify(value))
}

const upload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    const file = files[0]
    isLoading.value = true

    try {
      const response = await createPost(file)
      if (response.success === true) {
        setCreator(response.data.id)
        router.push({ name: 'post', params: { id: response.data.id } })
      }
    } finally {
      isLoading.value = false
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
          <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="mb-5">
              <img src="@/assets/upload.jpg" class="img-fluid rounded" alt="Upload" />
            </div>
            <div>
              <input
                ref="inputRef"
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                class="d-none"
                @change="upload"
              />
              <button
                type="button"
                class="btn btn-dark btn-lg"
                :disabled="isLoading"
                @click="chooseFile"
              >
                <template v-if="isLoading">
                  <span class="spinner-border spinner-border-sm me-2" />
                  <span>Uploading...</span>
                </template>
                <template v-else>Choose Photo/GIF</template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

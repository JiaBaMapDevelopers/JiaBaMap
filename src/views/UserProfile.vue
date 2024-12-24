<script setup>
import UserTab from '../components/userProfile/UserTab.vue'
import RatingCard from '../components/userProfile/RatingCard.vue';
import UserSettings from '../components/userProfile/UserSettings.vue';
</script>

<template>
    <div class="mt-2">
        <div class="justify-center w-3/4 m-auto sm:flex gap-9">
            <div class="w-full">
                <UserSettings />
                <UserTab />
            </div>
            <div class="w-full h-screen my-10 sm:w-1/3">
                <RatingCard />
            </div>
        </div>
    </div>
</template>

<template>
    <div class="px-6">
        <div class="flex justify-between mb-1">
            <span class="text-md font-medium text-black">{{ step }}</span>
            <span class="text-md font-medium text-black">{{ progress }}%</span>
        </div>
        <div class="w-full bg-[var(--thymeProgressBackground)] rounded-full h-2.5 ">
            <div class="bg-[var(--thymeProgress)] h-2.5 rounded-full" :style="`width: ${progress}%`"></div>
        </div> 
    </div>  
</template>

<script lang="ts">

    export default {
        data() {
            return {
                progress: 0,
                step: "Step" 
            }
        },
        methods: {
            updateProgress(value: number) {
                this.progress = Math.round(value)
            },
            updateStep(value: string) {
                this.step = value
            }
        }
    }
</script>

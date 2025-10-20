import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from '@vite-pwa/vite-plugin'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
            manifestFilename: 'manifest.json',
            includeManifestIcons: false,
        }),
    ],
})
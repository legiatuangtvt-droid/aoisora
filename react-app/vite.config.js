import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Chỉ định thư mục đầu ra là `public/react-dist`
    outDir: path.resolve(__dirname, '../public/react-dist'),
    // 2. Xóa thư mục build cũ trước mỗi lần build mới
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 3. Đảm bảo tên file đầu ra không có mã hash ngẫu nhiên
        // để chúng ta có thể link đến chúng một cách cố định.
        entryFileNames: `main.js`,
        chunkFileNames: `main.js`,
        assetFileNames: `style.css`,
      },
    },
  },
})

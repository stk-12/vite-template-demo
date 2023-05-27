import { defineConfig } from 'vite';

//import設定を追記
import { resolve } from 'path';


export default defineConfig({
  base: "/base_url/", //ベースとなるパブリックパス
  root: "./src", //開発ディレクトリ設定 index.htmlが置かれている場所
  // publicDir: resolve(__dirname, 'src/public'),
  // publicDir: "./src/public",
  build: {
		outDir: "../dist", //出力場所の指定
    rollupOptions: { //ファイル出力設定
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];

          // if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
          //   extType = 'images';
          // }

          //ビルド時のCSS名
          if(extType === 'css') {
            return `assets/css/style.css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        // entryFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/script.js',
        // chunkFileNames: 'assets/js/[name]-[hash].js',
      },
      //生成オブジェクトを渡す
      input:{
        index: resolve(__dirname, './src/index.html'),
        // about: resolve(__dirname, './src/about/index.html')
      }
    },
	},
});
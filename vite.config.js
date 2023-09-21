import { defineConfig } from 'vite';
import autoprefixer from "autoprefixer";
// import viteImagemin from 'vite-plugin-imagemin';
import imageminPlugin from '@macropygia/vite-plugin-imagemin-cache'

// import設定を追記
import { resolve } from 'path';

// HTMLの複数出力を自動化する
//./src配下のファイル一式を取得
import fs from 'fs';
import path from 'path';

const files = [];
function readDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      // componentsディレクトリを除外する
      if (item === 'components') {
        continue;
      }

      readDirectory(itemPath);
    } else {
      // htmlファイル以外を除外する
      if (path.extname(itemPath) !== '.html') {
        continue;
      }

      // nameを決定する
      let name;
      if (dirPath === path.resolve(__dirname, 'src')) {
        name = path.parse(itemPath).name;
      } else {
        const relativePath = path.relative(path.resolve(__dirname, 'src'), dirPath);
        const dirName = relativePath.replace(/\//g, '_');
        name = `${dirName}_${path.parse(itemPath).name}`;
      }

      // pathを決定する
      const relativePath = path.relative(path.resolve(__dirname, 'src'), itemPath);
      const filePath = `/${relativePath}`;

      files.push({ name, path: filePath });
    }
  }
}
readDirectory(path.resolve(__dirname, 'src'));
const inputFiles = {};
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  inputFiles[file.name] = resolve(__dirname, './src' + file.path );
}
/*
  この形を自動的に作る
  input:{
    index: resolve(__dirname, './src/index.html'),
    list: resolve(__dirname, './src/list.html')
  }
*/

export default defineConfig({
  // base: "/base_url/", //ベースパス（ルートパス）
  base: "./", //ベースパス（相対パス）
  root: "./src", //開発ディレクトリ設定 index.htmlが置かれている場所
  // publicDir: "./src/public",
  // publicDir: resolve(__dirname, 'src/public'),
  // publicDir: "./src/public",
  build: {
		outDir: "../dist", //出力場所の指定
    rollupOptions: { //ファイル出力設定
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          }

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
      // 
      input: inputFiles,
    },
	},
  css: {
    postcss: {
      plugins: [autoprefixer]
    }
  },
  // plugins: [
  //   viteImagemin({
  //     gifsicle: {
  //       optimizationLevel: 7,
  //       interlaced: false,
  //     },
  //     optipng: {
  //       optimizationLevel: 7,
  //     },
  //     mozjpeg: {
  //       quality: 20,
  //     },
  //     pngquant: {
  //       quality: [0.8, 0.9],
  //       speed: 4,
  //     },
  //     svgo: {
  //       plugins: [
  //         {
  //           name: 'removeViewBox',
  //         },
  //         {
  //           name: 'removeEmptyAttrs',
  //           active: false,
  //         },
  //       ],
  //     },
  //   }),
  // ],
  plugins: [
    imageminPlugin({
      cacheDir: '.cache',
      concurrency: 4,
      plugins: {
        pngquant: { quality: [0.65, 1] },
        mozjpeg: { quality: 85 },
      },
      // asset: {
      //   useCrc: true,
      // }
    }),
  ],
  
});
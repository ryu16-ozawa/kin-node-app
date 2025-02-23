const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ `/` ルート（動作確認用）
app.get('/', (req, res) => {
    res.send("Hello, Render! 🚀 Your app is running!");
});

// ✅ `/open` エンドポイント
app.get('/open', (req, res) => {
    let relativePath = req.query.path;

    if (!relativePath) {
        return res.status(400).send('Error: No path provided');
    }

    try {
        relativePath = decodeURIComponent(relativePath);
    } catch (error) {
        console.error('URI Decoding Error:', error);
        return res.status(400).send('Invalid file path encoding.');
    }

    // ✅ 環境変数 `KINTONE_LINK_FILEPATH` が設定されているか確認
    const kintoneBasePath = process.env.KINTONE_LINK_FILEPATH;
    if (!kintoneBasePath) {
        return res.status(500).send('Error: KINTONE_LINK_FILEPATH is not set');
    }

    // ✅ フルパスを作成
    const fullPath = `${kintoneBasePath}\\${relativePath}`;
    console.log(`Opening: ${fullPath}`);

    // ✅ Windowsのエクスプローラーを開くコマンドはRenderで動かないため、代替メッセージを返す
    res.send(`Server running on Render, cannot open folders directly. Try on your local machine: ${fullPath}`);
});

// ✅ PORT を環境変数から取得
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

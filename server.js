const express = require('express');
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
    console.log("Received request to /open");

    let relativePath = req.query.path;

    console.log("Query path:", relativePath);

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
        console.error('Error: KINTONE_LINK_FILEPATH is not set');
        return res.status(500).send('Error: KINTONE_LINK_FILEPATH is not set');
    }

    // ✅ フルパスを作成
    let fullPath;
    if (relativePath.startsWith("C:\\")) {
        fullPath = relativePath;
    } else {
        fullPath = `${kintoneBasePath}\\${relativePath}`;
    }

    console.log(`Returning Full Path: ${fullPath}`);

    // ✅ フルパスのみをレスポンスとして返す（kintone側で処理）
    res.send(fullPath);
});

// ✅ PORT を環境変数から取得
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

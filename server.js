const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// 環境変数からDropboxのパスを取得
const kintoneBasePath = process.env.KINTONE_LINK_FILEPATH;

app.get('/open', (req, res) => {
    let relativePath;

    try {
        // URLエンコードされた相対パスをデコード
        relativePath = decodeURIComponent(req.query.path);
    } catch (error) {
        console.error('URI Decoding Error:', error);
        return res.status(400).send('Invalid file path encoding.');
    }

    // 相対パスの前に環境変数のベースパスを追加
    const fullPath = `${kintoneBasePath}\\${relativePath}`;

    console.log(`Opening: ${fullPath}`);

    exec(`start "" explorer "${fullPath}"`, { shell: true }, (err) => {
        if (err) {
            console.error('Error opening folder:', err);
            res.status(500).send(`Error opening folder: ${err.message}`);
        } else {
            res.send('Folder opened successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

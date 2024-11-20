const https = require('https');
const fs = require('fs');
const path = require('path');

// URL of a sample plant image (a common houseplant)
const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Monstera_deliciosa_leaf.jpg/320px-Monstera_deliciosa_leaf.jpg';
const outputPath = path.join(__dirname, 'sample-plant.jpg');

https.get(imageUrl, (response) => {
    const fileStream = fs.createWriteStream(outputPath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
        console.log('Sample image downloaded successfully!');
        fileStream.close();
    });
}).on('error', (err) => {
    console.error('Error downloading image:', err);
});

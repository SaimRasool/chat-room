// Require necessary modules
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const path = require('path');
// API endpoint to receive data and write to a JSON file


app.use(express.json());
app.use(cors());

app.post('/addChannel', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const data = req.body; // Assuming data is sent in the request body
  

    const jsonData = JSON.stringify(data);
    const assetsPath = path.join(__dirname, '../src/assets');
    const fileToSend = path.join(assetsPath, 'channel.json');
    fs.writeFile(fileToSend, jsonData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error adding Channel' + err, res: false });
            return;
        }
        res.status(200).json({ message: 'Data appended to file', res: true });
    });
});

app.post('/addMessage', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const data = req.body; // Assuming data is sent in the request body
    const assetsPath = path.join(__dirname, '../src/assets/channelMessage.json');
    let jsonData = [];
        try {
            const existingData = fs.readFileSync(assetsPath, 'utf8');
            if (existingData != null&&existingData!="") {
            jsonData = JSON.parse(existingData);
            if (!Array.isArray(jsonData)) {
                jsonData = [];
            }
            jsonData = Array.from(jsonData)
        }
        } catch (error) {
            res.status(500).json({ message: 'Error Reading File' + err, res: false })
            return;
        }

    // Find the maximum existing ID
    const maxId = jsonData.reduce((max, item) => (item.channelMessageId > max ? item.channelMessageId : max), 0);

    // Increment the ID for the new data
    const newId = maxId + 1;
    data.channelMessageId = newId;
    jsonData.push(data)
    fs.writeFile(assetsPath, JSON.stringify(jsonData,null,2), 'utf8', (err) => {
        if (err) {
            res.status(500).json({ message: 'Mesage Not Save' + err, res: false });
            return;
        }
        res.status(200).json({ message: 'Mesage Save successfully',res:true });
    });
});
// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

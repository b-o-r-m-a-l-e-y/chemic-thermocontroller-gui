const path = require('path')
const express = require('express');
const app = express();
const port = 3000;

const http = require('http')
const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer);

io.on('connection', (socket) => {
  console.log('New socket connected')
})

// app.use(express.static(__dirname + '/'))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

httpServer.listen(port, () => {
  console.log(`HTTP server listening on ${port}`);
});

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const serialPort = new SerialPort('/tmp/vserial1', {
  baudRate: 9600
});

serialPort.on('readable', () => {
  var data = serialPort.read();
  console.log('Data:', data.toString());
  io.emit('serial:data', {
    value: data.toString()
  });
});

serialPort.on('open', () => {
  console.log('Serial port connected');
});

serialPort.on('err', (err) => {
  console.log(err.message);
});

const lineStream = serialPort.pipe(new Readline());
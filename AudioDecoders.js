"use strict"


async function getWavHeader(filePath) {
    const buffer = Buffer.alloc(44); // 44 bytes for WAV header
    let ret = {};
    try {
        let fh = await fsPromises.open(filePath, 'r');
        await fh.read(buffer, 0, 44, 0);
        await fh.close();
        ret.format = buffer.toString('ascii', 8, 12); // "WAVE"
        ret.channels = buffer.readUInt16LE(22);       // Number of channels
        ret.sampleRate = buffer.readUInt32LE(24);     // Sample Rate
        ret.byteRate = buffer.readUInt32LE(28);       // Byte Rate
        ret.bytesPerSample = buffer.readUInt16LE(32);     // Block Align
        ret.bitsPerSample = buffer.readUInt16LE(34);  // Bits per sample
        ret.dataSize = buffer.readUInt32LE(40);       // Size of the data section
    } catch (err) {
        console.error('Error reading WAV file:', err);
    }

    return ret;
}



function createReader(dataView) {
    var pos = 0;
  
    return {
      remain: function() {
        return dataView.byteLength - pos;
      },
      skip: function(n) {
        pos += n;
      },
      uint8: function() {
        var data = dataView.getUint8(pos, true);
  
        pos += 1;
  
        return data;
      },
      int16: function() {
        var data = dataView.getInt16(pos, true);
  
        pos += 2;
  
        return data;
      },
      uint16: function() {
        var data = dataView.getUint16(pos, true);
  
        pos += 2;
  
        return data;
      },
      uint32: function() {
        var data = dataView.getUint32(pos, true);
  
        pos += 4;
  
        return data;
      },
      string: function(n) {
        var data = "";
  
        for (var i = 0; i < n; i++) {
          data += String.fromCharCode(this.uint8());
        }
  
        return data;
      },
      pcm8: function() {
        var data = dataView.getUint8(pos) - 128;
  
        pos += 1;
  
        return data < 0 ? data / 128 : data / 127;
      },
      pcm8s: function() {
        var data = dataView.getUint8(pos) - 127.5;
  
        pos += 1;
  
        return data / 127.5;
      },
      pcm16: function() {
        var data = dataView.getInt16(pos, true);
  
        pos += 2;
  
        return data < 0 ? data / 32768 : data / 32767;
      },
      pcm16s: function() {
        var data = dataView.getInt16(pos, true);
  
        pos += 2;
  
        return data / 32768;
      },
      pcm24: function() {
        var x0 = dataView.getUint8(pos + 0);
        var x1 = dataView.getUint8(pos + 1);
        var x2 = dataView.getUint8(pos + 2);
        var xx = (x0 + (x1 << 8) + (x2 << 16));
        var data = xx > 0x800000 ? xx - 0x1000000 : xx;
  
        pos += 3;
  
        return data < 0 ? data / 8388608 : data / 8388607;
      },
      pcm24s: function() {
        var x0 = dataView.getUint8(pos + 0);
        var x1 = dataView.getUint8(pos + 1);
        var x2 = dataView.getUint8(pos + 2);
        var xx = (x0 + (x1 << 8) + (x2 << 16));
        var data = xx > 0x800000 ? xx - 0x1000000 : xx;
  
        pos += 3;
  
        return data / 8388608;
      },
      pcm32: function() {
        var data = dataView.getInt32(pos, true);
  
        pos += 4;
  
        return data < 0 ? data / 2147483648 : data / 2147483647;
      },
      pcm32s: function() {
        var data = dataView.getInt32(pos, true);
  
        pos += 4;
  
        return data / 2147483648;
      },
      pcm32f: function() {
        var data = dataView.getFloat32(pos, true);
  
        pos += 4;
  
        return data;
      },
      pcm64f: function() {
        var data = dataView.getFloat64(pos, true);
  
        pos += 8;
  
        return data;
      }
    };
}


module.exports.createReader = createReader;
module.exports.getWavHeader = getWavHeader;




















/*

function decodeData(reader, chunkSize, format, opts) {
    chunkSize = Math.min(chunkSize, reader.remain());
  
    var length = Math.floor(chunkSize / format.blockSize);
    var numberOfChannels = format.numberOfChannels;
    var sampleRate = format.sampleRate;
    var channelData = new Array(numberOfChannels);
  
    for (var ch = 0; ch < numberOfChannels; ch++) {
      channelData[ch] = new Float32Array(length);
    }
  
    var retVal = readPCM(reader, channelData, length, format, opts);
  
    if (retVal instanceof Error) {
      return retVal;
    }
  
    return {
      numberOfChannels: numberOfChannels,
      length: length,
      sampleRate: sampleRate,
      channelData: channelData
    };
  }
  
  function readPCM(reader, channelData, length, format, opts) {
    var bitDepth = format.bitDepth;
    var decoderOption = format.floatingPoint ? "f" : opts.symmetric ? "s" : "";
    var methodName = "pcm" + bitDepth + decoderOption;
  
    if (!reader[methodName]) {
      return new TypeError("Not supported bit depth: " + format.bitDepth);
    }
  
    var read = reader[methodName].bind(reader);
    var numberOfChannels = format.numberOfChannels;
  
    for (var i = 0; i < length; i++) {
      for (var ch = 0; ch < numberOfChannels; ch++) {
        channelData[ch][i] = read();
      }
    }
  
    return null;
  }
  */
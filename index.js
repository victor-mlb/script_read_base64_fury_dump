import fs from 'fs';
import es from 'event-stream';
import { gunzip } from 'zlib';

const process = (base64Value => {
  let bufferBase64 = Buffer.from(base64Value, 'base64');

  gunzip(bufferBase64, (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }

    fs.appendFile('result_base64.csv', `${buffer.toString()}\n` , (err) => {
      if(err) 
        throw err;
    });
  });
});

var s = fs.createReadStream('dump_1.json')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){
      let parsed = JSON.parse(line);
      process(parsed.Item.compressed_value.B);
    })
    .on('error', function(err){
        console.log('Error while reading file.', err);
    })
    .on('end', function(){
        console.log('Read entire file.')
        s.end();
    })
);
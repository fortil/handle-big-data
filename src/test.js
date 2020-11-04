// if (fs.existsSync(uniqFile)) {
//   // keeping the last tag for the unique keys
//   const r = fs.createReadStream(uniqFile);
//   const w = fs.createWriteStream(uniqFileTmp);

//   r.pipe(MapTags([tag, count])).pipe(w)
//     .on('end', () => {
//       w.close();
//       fs.renameSync(uniqFileTmp, uniqFile);
//     })
//     .on('error', (error) => {
//       this.emit('error', error);
//     });
// } else {
//   fs.writeFileSync(uniqFile, JSON.stringify({ [tag]: count }));
// }
const fs = require('fs');

function wrapReadlinkSync(orig) {
  return function (path, options) {
    try {
      return orig.call(fs, path, options);
    } catch (err) {
      if (err && err.code === 'EISDIR') {
        const e = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        e.code = 'EINVAL';
        throw e;
      }
      throw err;
    }
  };
}

function wrapReadlinkAsync(orig) {
  return function (path, ...args) {
    const cb = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    if (cb) {
      orig.call(fs, path, ...args, (err, res) => {
        if (err && err.code === 'EISDIR') {
          const e = new Error(`EINVAL: invalid argument, readlink '${path}'`);
          e.code = 'EINVAL';
          return cb(e);
        }
        cb(err, res);
      });
    } else {
      return orig.call(fs, path, ...args);
    }
  };
}

fs.readlinkSync = wrapReadlinkSync(fs.readlinkSync);
fs.readlink = wrapReadlinkAsync(fs.readlink);

if (fs.promises && fs.promises.readlink) {
  const origPromises = fs.promises.readlink;
  fs.promises.readlink = async function (path, options) {
    try {
      return await origPromises.call(fs.promises, path, options);
    } catch (err) {
      if (err && err.code === 'EISDIR') {
        const e = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        e.code = 'EINVAL';
        throw e;
      }
      throw err;
    }
  };
}

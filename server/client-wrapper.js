import {Evernote} from 'evernote';
import cheerio from 'cheerio';

const wrapUrl = (text) => {
  var url_pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/ig;
  return text.replace(url_pattern, (url) => `<a href="${url}" target="_blank">${url}</a>`);
};

const processContent = (note) => {
  const $ = cheerio.load(note, {xmlMode: true});

  $('br').html($('<p>XXXXX</p>'));
  const items = $('en-note div').text().split('XXXXX');

  const result = [];

  let isDate = true;
  
  for (var i = 0; i < items.length; i++) {
    const item = items[i];
    if (item === '') {
      isDate = true;
      continue;
    }

    if (isDate) {
      const date = item;
      const content = '';
      result.push({date, content});
      isDate = false;
    } else {
      const content = wrapUrl(item);
      if (result[result.length - 1].content) {
        result[result.length - 1].content += `<br>${content}`;
      } else {
        result[result.length - 1].content = content;
      }
    }
  };
  return result;
};

const getNotes = (token, guid, cb) => {
  const client = new Evernote.Client({token: token, sandbox: false});
  const noteStore = client.getNoteStore();
  
  noteStore.getNoteContent(guid, (err, note) => {
    if (err) {
      return cb(err);
    }
    return cb(null, processContent(note));
  });
};

module.exports = getNotes;
/**
 * CowsayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var cowsay = require('cowsay');

module.exports = {
  /**
   * `CowsayController.say()`
   */
  say: async function (req, res) {
    let count = await Sentences.count();
    console.debug('Got '+count+' sentences in database');
    var s = await Sentences.find().limit(1).
      skip(Math.floor(Math.random() * Math.floor(count)));
    let sentence = "Random Message";
    if(s.length > 0) {
      sentence = s[0].sentence;
    }
    
    return res.view('cowsay', { picture: s[0].picture, cow: cowsay.say({
      f: process.env.COW || 'stegosaurus',
      text : sentence,
      e : 'oO',
      T : 'U '
    })});
  },

  add: async function (req, res) {
    return res.view('add');
  },

  create: async function(req, res) {
    const options = {
      adapter: require('skipper-better-s3'),
      key: 'AKIAJOCSBD4KTGNIE2YQ' ,
      secret: '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',
      bucket : 'lp-cdad-2018',
      region: 'eu-west-3',
      s3params: {
        ACL: 'public-read'
      }
    }

    req.file('file').upload(options, async (err, uploadedFiles) => {
      if (err) return res.serverError(err);

      await Sentences.create({
        sentence: req.param('sentence'), picture: uploadedFiles[0].extra.Location 
      })
      return res.redirect('/say');
    })
  },
};


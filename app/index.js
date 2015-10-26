var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  constructor: function() {
    // Call super constructor
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var done = this.async();
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname // Default to current folder name
    }, function (answers) {
      this.log(answers.name);
      this.log(answers);
      done();
    }.bind(this));
  },

  // Installs
  install: function() {
    this.log('Installing bootstrap');
    this.bowerInstall(['bootstrap'], { 'save': true });
    this.log('Installing Slim');
    this.spawnCommand('composer', ['install']);
  }
});

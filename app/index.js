var generators = require('yeoman-generator');

var // Arrays of different dependencies to install
banner = [], // Banner dependencies
composer = false, // For Slim
email = [ // Email Dependencies
  'gulp-connect', 
  'gulp-inline-css', 
  'gulp-litmus', 
  'gulp-w3cjs'
],
php = [ // PHP site dependencies
  'gulp-autoprefixer', 
  'browser-sync', 
  'gulp-concat', 
  'gulp-connect-php', 
  'gulp-jshint', 
  'gulp-minify-css', 
  'gulp-rename', 
  'gulp-uglify', 
  'gulp-watch'
],
toInstall = [];


module.exports = generators.Base.extend({

  constructor: function() {
    // Call super constructor
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var done = this.async();
    this.prompt({
      choices: [ 'Banner', 'Email', 'PHP site'],
      type: 'list',
      name: 'template',
      message: 'Greetings Dev. What sort of template would you be needing for this project?',
      default: 'PHP site'
    }, function (answers) {

      switch (answers.template) {
        case 'Banner':
          this.log('Banner template coming soon');
          break;
        case 'Email':
          toInstall = email.slice(0);
          break;
        case 'PHP site':
          toInstall = php.slice(0);
          composer = true;
          break;
        default:
          break;
      }
      done();
    }.bind(this));
  },

  // Installs
  install: function() {
    this.log('Installing dependencies');
    // this.npmInstall(toInstall, { 'save': true });
    // this.installDependencies();
    if (composer) {
      this.log('Installing Slim');
      this.spawnCommand('composer', ['install']);
    }
  },

  paths: function() {
    this.destinationRoot('./build');
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      { header: 'Testing! Again!!' }
    );
  }

});

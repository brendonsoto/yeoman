var generators = require('yeoman-generator');

var // Booleans and dependency arrays
composer = false,         // For Slim
installPackages = true,   // Decides whether to install node packages
path = '',
banner = [],              // Banner dependencies
email = [                 // Email Dependencies
  'gulp-connect', 
  'gulp-inline-css', 
  'gulp-litmus', 
  'gulp-w3cjs'
],
html = [                  // HTML dependencies
  'browser-sync',
  'gulp-autoprefixer',
  'gulp-bootlint',
  'gulp-jshint',
  'gulp-minify-css',
  'gulp-rename',
  'gulp-uglify',
  'gulp-w3cjs',
  'gulp-watch'
],
php = [                 // PHP site dependencies
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
      choices: [ 'Banner', 'Email', 'HTML Site', 'PHP site'],
      type: 'list',
      name: 'template',
      message: 'Greetings Dev. What contraption are you building now?',
      default: 'PHP site'
    }, function (answers) {

      // Switch statement to set template path and Node packages to install
      // The Node packages are listed out in the toInstall array which
      // copies one of the arrays defined in the beginning of the file
      switch (answers.template) {
        case 'Banner':
          this.log('Banner template coming soon');
          break;
        case 'Email':
          path = 'email';
          toInstall = email.slice(0); // Copy Email array to toInstall
          break;
        case 'HTML Site':
          path = 'html';
          toInstall = html.slice(0); // Copy Email array to toInstall
          break;
        case 'PHP site':
          composer = true;
          path = 'php_site';
          toInstall = php.slice(0); // Copy PHP array to toInstall
          break;
        default:
          break;
      }
      done();
    }.bind(this));
  },

  // Installs
  install: function() {
    if (installPackages) {
      this.log('Installing dependencies');
      // this.npmInstall(toInstall, { 'save': true });
      // this.installDependencies();
      if (composer) {
        this.log('Installing Slim');
        this.spawnCommand('composer', ['install']);
      }
    }
  },

  paths: function() {
    this.destinationRoot('./build');
  },

  writing: {

    gulpfile: function() {
      this.log(path);
      this.fs.copyTpl(
        this.templatePath(path + "/gulpfile.js"),
        this.destinationPath('gulpfile.js')
      );
    },

    testTemplate: function() {
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('index.html'),
        { header: 'Testing! Again!!' }
      );
    }
  }

});

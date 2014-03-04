$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "infopik/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "infopik"
  s.version     = Infopik::VERSION
  s.authors     = ["Hearty, Oh"]
  s.email       = ["heartyoh@gmail.com"]
  s.homepage    = "http://github.com/heartyoh/infopik"
  s.summary     = "A gem for infographic javascript library with rails"
  s.description = "This gem provides infographic javascript library for your Rails 3 application."
  s.license     = "MIT"

  s.required_rubygems_version = ">= 1.3.6"
  
  s.add_dependency "railties", ">= 3.0", "< 5.0"
  s.add_dependency "dou-rails", ">= 0.0.2"
  s.add_dependency "bwip", ">= 0.6"
  
  s.files = Dir["lib/**/*.rb", "vendor/assets/**/*", "MIT-LICENSE", "README.md"]
  s.require_path = 'lib'
end

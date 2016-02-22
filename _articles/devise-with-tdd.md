---
title: "Devise through Test Driven Development"
date: 2015.02.04
tags:
  - ruby
  - rails
  - devise
  - authentication
  - tdd
publish: true
---

Authentication is an integral part of many web application nowadays. Rails
already makes it easy to roll your own authentication, and Devise makes it
easier still.

In this post, I\'ll be using test driven development (TDD) to show you how to
build a simple application using Devise for authentication. The final
application will have the fowlling features:

- logging in
- logging out
- signing up
- password recovery
- deployed on heroku


As for the application we will be building, it will simply list all the
registered user\'s names upon successful authentication.

I highly encourage you to follow the TDD steps, it will make developing the
application very straight forward, and I believe you will find it more
intuitive on what to do next (I find this to be true with TDD in general).
Regardless, you can still follow along without writing any specs if you wish.

**Creating the application**

Since the app will be hosted on Heroku, we need to be using Postgres for the
database. I also prefer to use Rspec for the testing framework and will skip
the Test::Unit files.
```bash
# '-d postgresql' configures the rails app to use Postgres
# '-T' skips the Test::Unit files
rails new userbase -d postgresql -T
```

Since we are using Postgres, we will also need to create the appropriate
databases on our local machine (take a look at `config/database.yml`).

```bash
# postgres must already be installed on your machine
createdb userbase_development
createdb userbase_test
```

*Note: if you get `FATAL: role YOUR_USERNAME does not exist`, you will need to
create a role for yourself with database creation permissions. To find out how,
check out
[this DigitalOcean post](https://www.digitalocean.com/community/tutorials/how-to-use-roles-and-manage-grant-permissions-in-postgresql-on-a-vps--2)
on how to create roles and more.*

Edit the `Gemfile`, add the following gems and run `bundle`.

```ruby
...
group :development, :test do
  gem 'rspec-rails'
  gem 'guard-rspec'
  gem 'capybara'
  gem 'factory_girl_rails'
  ...
end

gem 'devise'
# required for Heroku
gem 'rails_12factor', group: :production
```

Next, run the following to install Rspec, add Guard definition and start Guard
respectively.

```bash
rails g rspec:install
guard init rspec
guard
```

Now add `require 'capybara/rspec'` in `spec/spec_helper.rb`.

**Building the application through Test Driven Development**

We will be using Capybara with Rspec to write high level feature specs. With
Guard already running create the spec file `home_page_spec.rb` in the
`spec/features/` directory.

For now this will describe and  get us to build the basic application:

```ruby
require 'rails_helper'

describe 'the home page' do
  it 'shows a list of users' do
    user = FactoryGirl.create(:user)

    visit root_path

    expect(page).to have_content 'List of users'
    expect(page).to have_content user.name
  end
end
```

As a guide for the rest of the post, the errors or failures are what you should
see in your Guard interface and the fixes are what is required to fix the issue
and move forward in our development.

#### FAIL

`ArgumentError: Factory not registered: user`

#### FIX

Set up a user factory at `spec/factories/users.rb`:

```ruby
FactoryGirl.define do
  factory :user do
    name 'Jane Doe'
  end
end
```

#### FAIL

`NameError: uninitialized constant User`

#### FIX

This is because at the moment we have no User model. We can generate a User
model with a name attribute by running:

```bash
rails g model user name:string
# do not override the User factory
```

At this point run `rake db:migrate` and restart Guard.

#### FAIL

`NameError: undefined local variable or method 'root_path' for #<RSpec::ExampleGroups::TheHomePage:0x0000000741f800>`

#### FIX

Define the root path in `config/routes.rb`

```ruby
Rails.application.routes.draw do
  root 'users#index'
  ...
```

#### FAIL

`ActionController::RoutingError: uninitialized constant UsersController`

#### FIX

Generate the appropriate controller and view:

```bash
# to skip the spec, helper and asset files append the following:
# --no-controller-specs --no-view-specs --no-helper --no-assets
rails g controller users index
```

#### FAIL

`expected to find text "List of users" in "Users#index Find me in app/views/users/index.html.erb"`

#### FIX

We want the view to show a list of users. Edit the view at
`app/views/users/index.html.erb`:

```erb
<h1>List of users</h1>

<ol>
  <% @users.each do |user| %>
    <li><%= user.name %></li>
  <% end %>
</ol>
```

#### FAIL

`ActionView::Template::Error: undefined method 'each' for nil:NilClass`

#### FIX

We fix this by defining `@users` in the controller at
`app/controllers/users_controller.rb`

```ruby
class UsersController < ApplicationController
  def index
    @users = User.all
  end
end
```

Now all the specs should pass, and our basic application is complete! Now it is
time to start authenticating our users in order to access this page.

**Authenticating users with Devise**

Since users must be logged in (i.e. authenticated) in order to have access to
this page, the home page will be different depending on whether the user is
logged in or not. In Rspec, this is handled by using
<a href="http://betterspecs.org/#contexts" target="_blank">contexts</a>.

Here is the new `home_page_spec.rb` file that tests the `log in`, `log out`,
`sign up`, and `password recovery`.

```ruby

require 'rails_helper'

describe 'the home page' do
  let(:user) { FactoryGirl.create(:user) }

  before :each do
    visit root_path
  end

  context 'when the user is not logged in' do
    it 'allows the user to log in' do
      fill_in 'Email', with: user.email
      fill_in 'Password', with: user.password
      click_button 'Log in'

      expect(page).to have_content 'List of users'
      expect(page).to have_content user.name
    end

    it 'allows the user to sign up' do
      click_link 'Sign up'
      fill_in 'Name', with: 'John Doe'
      fill_in 'Email', with: 'john_doe@example.com'
      fill_in 'Password', with: 'password'
      fill_in 'Password confirmation', with: 'password'
      click_button 'Sign up'

      expect(page).to have_content 'List of users'
      expect(page).to have_content 'John Doe'
    end

    it 'allows the user to recover their password' do
      click_link 'Forgot your password'
      fill_in 'Email', with: user.email
      click_button 'Send'

      expect(ActionMailer::Base.deliveries.empty?).to be false
    end
  end

  context 'when the user is logged in' do
    before :each do
      fill_in 'Email', with: user.email
      fill_in 'Password', with: user.password
      click_button 'Log in'
    end

    it 'allows the user to log out' do
      click_link 'Log out'
      expect(page).to have_no_content 'List of users'
    end
  end
end
```

But before we start analyzing the failures/errors from Guard, add the email and
password attributes in our user factory:

```ruby
FactoryGirl.define do
  factory :user do
    name 'Jane Doe'
    email 'jane_doe@example.com'
    password 'password'
  end
end
```

Great, now we can finally start going from \"red to green\" with our test
driven development. There are several errors showing up on Guard, but we will
be focusing on the first one.

#### FAIL

`NoMethodError: undefined method 'email=' for #<User:0x00000005c9b3f0>`

Our user model does not have an email attribute (or password for that 
matter). We are going to add all the attributes required for authentication
using Devise. 

#### FIX

Install Devise, by running:

```bash
rails g devise:install
```

Devise will inform you that some manual set up is required on our part.
We do not need to follow all of them, the ones we require are:

- Edit the `development.rb` and `test.rb` file in `config/environments`

```ruby  
Rails.application.configure do
...
config.action_mailer.default_url_options = { host: 'localhost:3000' }
end
```

- Add flash messages to our `app/views/layouts/application.html.erb`

```erb
...
<body>

  <% flash.each do |name, msg| %>
    <%= content_tag :div, msg, class: name %>
  <% end %>

  <%= yield %>

</body>
...
```

- Install the Devise views, we will need them to let our users input
their name when signing up or editing their profile.

```bash
rails g devise:views
```

We are now ready to add Devise to our users, which is very easily done
by running:

```bash
rails g devise user
# run the migration created by Devise
rake db:migrate
```

Don\'t for get to restart Guard! Again, Guard will show several errors/failures
but we only need to focus on the first one.

#### FAIL

`Capybara::ElementNotFound: Unable to find field "Email"`

#### FIX

This is because the authentication screen is not yet showing up upon visiting
the root url. We need to block access to our index action and ask the user to
log in (or sign up) before proceeding. We do this by adding a `before_action`
in our `users_controller`, and our log in should work:

```ruby

class UsersController < ApplicationController
  before_action :authenticate_user!
  ...
```

\.\.\.and we barely had to write any code at all!

#### FAIL
`Capybara::ElementNotFound: Unable to find field "Name"`

#### FIX

We need to edit the views we installed with Devise to allow users to input
their name. Edit the `new.html.erb` and `edit.html.erb` files in
`app/views/devise/registrations/` directory, and add a name field above the
email field.

```erb
...
  <div class="field">
    <%= f.label :name %><br />
    <%= f.text_field :name, autofocus: true %>
  </div>

  <div class="field">
    <%= f.label :email %><br />
    <%= f.email_field :email %>
  </div>
...
```

#### FAIL

Now the Guard interface shows a very interesting failure:

`expected to find text "John Doe" in "Welcome! You have signed up successfully.
List of users"`

#### FIX

It indicates that the sign up process was successful, but `John Doe` was
not found on the page. What happened? Well, Devise uses
<a href="https://github.com/plataformatec/devise#strong-parameters" target="_blank">
strong parameter
</a>
(as it should), and we need to permit this in the `application_controller`.
In our case we need to edit the `application_controller` like this

```ruby

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) do |u|
      u.permit(:name,
               :email,
               :password,
               :password_confirmation,
               :remember_me)
    end

    devise_parameter_sanitizer.for(:account_update) do |u|
      u.permit(:name,
               :email,
               :password,
               :password_confirmation,
               :current_password)
    end
  end
end
```

Now all our specs in the context of when the user is not logged in should pass!
There should be a single error showing up on Guard.

#### FAIL

`Capybara::ElementNotFound: Unable to find link "Log out"`

#### FIX

We have not provided a link in the home page to allow users to log out. Let\'s
add a link that allows the user to log out at the top of our view
`app/views/users/index.html.erb`

```erb
<%= link_to 'Log out', destroy_user_session_path, method: :delete %>
  ...
```

The `destroy_user_session_path` is provided by Devise among many other useful
routes, you can check by running `rake routes`.

And now all our specs should pass! We now have an application with
an authentication system, allowing users to log in, log out, sign up and
recover passwords. However, the password recovery requires some extra
configuration in the production environment (Heroku), as you will see very
soon.

**Deploying to Heroku**

The deployment itself is very easy. Assuming you have git and heroku-toolbelt
installed, you can deploy and open the application on your browser by running:

```bash
# initializing git
git init .
git add -A
git commit -m 'init'
# deploying to heroku
heroku create
git push heroku master
# run the migration on heroku server (required)
heroku run rake db:migrate
# open the application
heroku open
```

Everything should be working except password recovery. Trying to recover
password should result in an error page. After an unsuccessful attempt, check
the logs by running `heroku logs`.

You should see the line:

`ActionView::Template::Error (Missing host to link to! Please provide the :host parameter, set default_url_options[:host], or set :only_path to true):`

Remeber how we defined `default_url_options` for the development
and test environments? We must do the same for our production
environment, but it will vary on your heroku app name.

Add this line to your `config/environments/production.rb` file

```ruby
...
config.action_mailer.default_url_options { host: YOUR-HEROKU-APP-NAME.herokuapp.com }
```

This alone is not enough, Heroku recommends using sendgrid for 
mail delivery. To do this there is a very clear guide provided
by Heroku
<a href="https://devcenter.heroku.com/articles/sendgrid" target="_blank">here</a>.
I will summarize this here. All that is required to do is:

```bash
# free version
heroku addons:add sendgrid:starter
```

and append the following to `config/environment.rb`

```ruby
...
ActionMailer::Base.smtp_settings = {
  :address        => 'smtp.sendgrid.net',
  :port           => '587',
  :authentication => :plain,
  :user_name      => ENV['SENDGRID_USERNAME'],
  :password       => ENV['SENDGRID_PASSWORD'],
  :domain         => 'heroku.com',
  :enable_starttls_auto => true
}
```

Now if you try to recover password for an account, (assuming you are using your
personal email), you should get an email shortly! The email will include a link
to change the password. If you are feeling impatient, check `heroku logs` and
you should see the email body that was sent.

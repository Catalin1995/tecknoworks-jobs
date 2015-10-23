Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  apipie
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope :api, defaults: { format: :json } do
    resources :jobclient, only: [:index, :show]
    put '/login', to: 'users#login'
    get '/logged/:id', to: 'users#logged'
    delete '/logout/:id', to: 'users#logout'
    resources :jobs, only: [:index, :show, :create, :destroy, :update]
    get '/all_candidates', to: 'candidates#all_candidates'
    resources :candidates, only: [:index, :show, :create, :destroy, :update]
    resources :interviews, only: [:index, :show, :create, :destroy]
    resources :attachments, only: [:index, :show, :create, :destroy]
    resources :comments, only: [:index, :create]
  end

  post 'test_ldap_auth', to: 'tkw_auth_tests#create' if Rails.env.test?

  get '/*path' => redirect('/?goto=%{path}')
end

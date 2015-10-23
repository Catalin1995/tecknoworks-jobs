require 'rails_helper'

RSpec.describe Candidate, type: :routing do
  it 'routes to #index' do
    expect(get: '/api/candidates').to route_to(controller: 'candidates', action: 'index', format: :json)
    expect(get: '/api/all_candidates').to route_to(controller: 'candidates', action: 'all_candidates', format: :json)
  end

  it 'routes to #show' do
    expect(get: '/api/candidates/1').to route_to(controller: 'candidates', action: 'show', id: '1', format: :json)
  end

  it 'routes to #create' do
    expect(post: '/api/candidates').to route_to(controller: 'candidates', action: 'create', format: :json)
  end

  it 'routes to #destroy' do
    expect(delete: '/api/candidates/1').to route_to(controller: 'candidates', action: 'destroy', id: '1', format: :json)
  end

  it 'routes to #update' do
    expect(patch: '/api/candidates/1').to route_to(controller: 'candidates', action: 'update', id: '1', format: :json)
  end
end

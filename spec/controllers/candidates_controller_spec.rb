require 'rails_helper'

RSpec.describe CandidatesController, type: :controller do
  render_views

  before(:each) do
    @job = create :job
    @job2 = create :job
    @key = create :key
  end

  let(:consumer_key) { return @key.consumer_key }
  let(:secret_key) { return @key.secret_key }
  let(:valid_candidate) { return { full_name: 'ionut', phone_number: '0722222222', email: 'test@example.com', job_id: @job.id, source: 'user_tkw', status: 1 } }

  describe 'GET index' do
    it 'when user is logged' do
      create :candidate, job_id: @job.id
      create :candidate, job_id: @job.id
      create :candidate, job_id: @job2.id

      get :index, consumer_key: consumer_key, secret_key: secret_key, job_id: @job.id, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body].count).to eq(2)

      get :index, consumer_key: consumer_key, secret_key: secret_key, job_id: @job2.id, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body].count).to eq(1)

      get :index, consumer_key: consumer_key, secret_key: secret_key, job_id: -1, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body].count).to eq(0)
    end

    it 'when user is not logged' do
      create :candidate, job_id: @job.id

      get :index, consumer_key: '', secret_key: '', job_id: @job.id, format: :json
      expect(json[:code]).to eq(400_001)
      expect(json[:body]).to eq('You are not logged')
    end
  end

  describe 'GET all_candidates' do
    it 'when user is logged' do
      get :all_candidates, consumer_key: consumer_key, secret_key: secret_key, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body].count).to eq(0)

      create :candidate, job_id: @job.id
      get :all_candidates, consumer_key: consumer_key, secret_key: secret_key, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body].count).to eq(1)

      create :candidate, job_id: @job.id
      create :candidate, job_id: @job2.id

      get :all_candidates, consumer_key: consumer_key, secret_key: secret_key, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body].count).to eq(3)
    end

    it 'when user is not logged' do
      create :candidate, job_id: @job.id

      get :all_candidates, consumer_key: '', secret_key: '', format: :json
      expect(json[:code]).to eq(400_001)
      expect(json[:body]).to eq('You are not logged')
    end
  end

  describe 'GET show' do
    it 'when user is logged' do
      candidate1 = create :candidate, job_id: @job.id
      candidate2 = create :candidate, job_id: @job2.id

      get :show, consumer_key: consumer_key, secret_key: secret_key, id: candidate1.id, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body][:job_id]).to eq(@job.id)

      get :show, consumer_key: consumer_key, secret_key: secret_key, id: candidate2.id, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body][:job_id]).to eq(@job2.id)
    end

    it 'when user is not logged' do
      candidate1 = create :candidate, job_id: @job.id

      get :show, consumer_key: '', secret_key: '', id: candidate1.id, format: :json
      expect(json[:code]).to eq(400_001)
      expect(json[:body]).to eq('You are not logged')
    end

    it 'returns 404 if record not found' do
      expect do
        get :show, consumer_key: consumer_key, secret_key: secret_key, id: -1
      end.to raise_error ActiveRecord::RecordNotFound
    end
  end

  describe 'POST create' do
    it 'when user is logged' do
      expect do
        post :create, consumer_key: consumer_key, secret_key: secret_key, candidate: valid_candidate, format: :json
      end.to change { Candidate.count }.by 1

      expect(json[:code]).to eq(200)
      expect(json[:body][:phone_number]).to eq('0722222222')
      expect(json[:body][:full_name]).to eq('ionut')
      expect(json[:body][:email]).to eq('test@example.com')
      expect(json[:body][:job_id]).to eq(@job.id)
      expect(json[:body][:status]).to eq(1)
    end

    it 'when user is not logged' do
      post :create, consumer_key: '', secret_key: '', candidate: valid_candidate, format: :json
      expect(json[:code]).to eq(400_001)
      expect(json[:body]).to eq('You are not logged')
    end

    it 'when one argument not exist' do
      expect do
        post :create, consumer_key: consumer_key, secret_key: secret_key, candidate: { full_name: 'ionut', phone_number: '0722222222', job_id: @job.id }, format: :json
      end.to raise_error ActiveRecord::RecordInvalid
    end

    it 'when job not exit' do
      expect do
        post :create, consumer_key: consumer_key, secret_key: secret_key, candidate: { full_name: 'ionut', phone_number: '0722222222', job_id: -1, email: 'test@example.com' }, format: :json
      end.to raise_error ActiveRecord::RecordInvalid
    end
  end

  describe 'DELETE destroy' do
    it 'when user is logged' do
      candidate = create :candidate, job_id: @job.id

      expect do
        delete :destroy, consumer_key: consumer_key, secret_key: secret_key, id: candidate.id, format: :json
      end.to change { Candidate.count }.by(-1)
    end

    it 'when user is not logged' do
      candidate = create :candidate, job_id: @job.id

      delete :destroy, consumer_key: '', secret_key: '', id: candidate.id, format: :json
      expect(json[:code]).to eq(400_001)
      expect(json[:body]).to eq('You are not logged')
    end

    it 'candidate not exist' do
      expect do
        delete :destroy, consumer_key: consumer_key, secret_key: secret_key, id: -1, format: :json
      end.to raise_error ActiveRecord::RecordNotFound
    end
  end

  describe 'PATCH update' do
    it 'update a single field' do
      candidate = create :candidate, job_id: @job.id, status: -1

      patch :update, consumer_key: consumer_key, secret_key: secret_key, candidate: { full_name: 'cata' }, id: candidate.id, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body][:full_name]).to eq('cata')
      expect(json[:body][:phone_number]).to eq(candidate.phone_number)
      expect(json[:body][:email]).to eq(candidate.email)
      expect(json[:body][:job_id]).to eq(candidate.job_id)
      expect(json[:body][:status]).to eq(candidate.status)
    end

    it 'update a single field when user is not logged' do
      candidate = create :candidate, job_id: @job.id

      patch :update, consumer_key: '', secret_key: '', candidate: { full_name: 'cata' }, id: candidate.id, format: :json
      expect(json[:code]).to eq(400_001)
      expect(json[:body]).to eq('You are not logged')
    end

    it 'update all fields' do
      candidate = create :candidate, job_id: @job.id

      patch :update, consumer_key: consumer_key, secret_key: secret_key, candidate: valid_candidate, id: candidate.id, format: :json
      expect(json[:code]).to eq(200)
      expect(json[:body][:full_name]).to eq('ionut')
      expect(json[:body][:phone_number]).to eq('0722222222')
      expect(json[:body][:email]).to eq('test@example.com')
      expect(json[:body][:job_id]).to eq(candidate.job_id)
      expect(json[:body][:status]).to eq(1)
    end

    it 'job not exist' do
      candidate = create :candidate, job_id: @job.id

      expect do
        patch :update, consumer_key: consumer_key, secret_key: secret_key, candidate: { job_id: -1, full_name: 'cata', phone_number: '0777777777', email: 'test@test.com' }, id: candidate.id, format: :json
      end.to raise_error ActiveRecord::RecordInvalid
    end
  end
end

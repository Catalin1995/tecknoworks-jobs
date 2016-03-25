require 'rails_helper'

RSpec.describe Candidate, type: :model do
  let(:candidate) { create :candidate }

  it { expect(subject).to have_many :attachments }
  it { expect(subject).to belong_to :job }

  it { expect(subject).to validate_presence_of :full_name }
  it { expect(subject).to validate_presence_of :phone_number }
  it { expect(subject).to validate_presence_of :email }
  it { expect(subject).to validate_presence_of :job }
  it { expect(subject).to validate_presence_of :source }

  it 'works' do
    expect(candidate).to be_valid
  end

  it 'create candidate' do
    job = create :job, description: 'test'
    candidate = create :candidate, job_id: job.id
    expect(candidate.job_id).to eq(job.id)
    expect(candidate.phone_number).to eq('0755555555')
    expect(candidate.email).to eq('email@example.com')
    expect(candidate.full_name).to eq('Full Name')
    expect(candidate.source).to eq('tkw user')
    expect(candidate.status).to eq(0)
  end

  it 'invalid email format' do
    expect do
      create :candidate, email: 'test@test@test.com'
    end.to raise_error { ActiveRecord::RecordInvalid }

    expect do
      create :candidate, email: 'test.com'
    end.to raise_error { ActiveRecord::RecordInvalid }

    expect do
      create :candidate, email: ''
    end.to raise_error { ActiveRecord::RecordInvalid }
  end

  it 'validate phone number' do
    expect do
      create :candidate, phone_number: '07555a5555'
    end.to raise_error { ActiveRecord::RecordInvalid }

    expect do
      create :candidate, phone_number: ''
    end.to raise_error { ActiveRecord::RecordInvalid }

    expect do
      create :candidate, phone_number: '12231432'
    end.to raise_error { ActiveRecord::RecordInvalid }
  end

  it 'validate status' do
    candidate = create :candidate
    expect(candidate.status).to eq(0)

    candidate = create :candidate, status: 1
    expect(candidate.status).to eq(1)

    candidate = create :candidate, status: -1
    expect(candidate.status).to eq(-1)
  end

end

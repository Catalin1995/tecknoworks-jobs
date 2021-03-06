require 'rails_helper'

RSpec.describe Job, type: :model do
  let(:job) { create :job }
  let(:job_with_invalid_status) { create :job_with_invalid_status }
  it { expect(subject).to have_many :candidates }

  it { expect(subject).to validate_presence_of :description }
  it { expect(subject).to validate_presence_of :status }

  it 'create job' do
    expect(job.title).to eq('Test')
  end

  it 'the first line is null' do
    job = create :job
    job.update(description: "\n for set \n #title")
    expect(job.title).to eq('')
    expect(job.status).to eq(Job::PUBLISHED)
  end

  it 'has a default status' do
    job = create :job_without_status
    expect(job.status).to eq(Job::DRAFT)
  end

  it 'does not allow a null description' do
    expect do
      create :job, description: ''
    end.to raise_error ActiveRecord::RecordInvalid
  end

  it 'only saves alpha numeric characters to the title' do
    job.update(description: "# Hello world\nHello")
    expect(job.title).to eq 'Hello world'
  end

  it 'status is not included in the list' do
    expect do
      job_with_invalid_status
    end.to raise_error ActiveRecord::RecordInvalid
  end

  context '#dashboard_description' do
    it 'returns the description for the first dashboard job' do
      create :job, status: Job::DASHBOARD, description: 'foo'
      expect(Job.dashboard_description).to eq 'foo'
    end

    it 'returns a blank string if no dashboard job exists' do
      expect(Job.dashboard_description).to eq ''
    end
  end
end

ActiveAdmin.register Job do
  permit_params :description, :status
  config.filters = false
  actions :all, except: [:show]

  sidebar "Candidates", only: [:edit] do
    ul do
      li link_to "List of candidates", admin_job_candidates_path(job)
      li link_to "Create new candidate", new_admin_job_candidate_path(job)
    end
  end

  controller do
    def scoped_collection
      super.where.not(status: Job::DASHBOARD)
    end
  end

  index do
    selectable_column
    column :id do |job|
      link_to job.id, edit_admin_job_path(job)
    end
    column :status do |job|
      begin
        job_status_select_values.find { |e| e[1] == job.status }.first
      rescue
        job.status
      end
    end
    column :title
    column "List of candidates" do |job|
      para link_to "List of candidates", admin_job_candidates_path(job)
    end
    column 'Create new candidate' do |job|
      para link_to "Create new candidate", new_admin_job_candidate_path(job)
    end
    actions
  end

  form do |f|
    columns do
      column do
        f.inputs 'Admin Details' do
          f.input :title, input_html: { disabled: true }
          f.input :status, as: :select, collection: job_status_select_values
          f.input :description
        end
        f.actions
      end
      column do
        render 'markdown_editor'
      end
    end
  end
end

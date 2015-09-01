ActiveAdmin.register Job do
  permit_params :description, :status

  actions :all, except: [:show]

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
    column :created_at
    column :updated_at
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

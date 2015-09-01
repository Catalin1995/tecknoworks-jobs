ActiveAdmin.register Interview do
  permit_params :candidate_id, :status, :user_id

  index do
    selectable_column
    column :status do |job|
      begin
        interview_status_select_values.find { |e| e[1] == job.status }.first
      rescue
        interview.status
      end
    end
    column :candidate
    column :user
    actions
  end

  form do |f|
    f.inputs 'Interview' do
      f.input :candidate
      f.input :user
      f.input :status, as: :select, collection: interview_status_select_values
    end
    f.actions
  end
end

ActiveAdmin.register Candidate do
  permit_params :full_name, :phone_number, :email, :job_id

  index do
    selectable_column
    column :id
    column :full_name
    column :phone_number
    column :email
    column :job
    actions
  end

  form do |f|
    f.inputs 'Interview' do
      f.input :job
      f.input :full_name
      f.input :phone_number
      f.input :email
    end
    f.actions
  end
end

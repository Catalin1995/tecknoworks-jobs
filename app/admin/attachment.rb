ActiveAdmin.register Attachment do
  belongs_to :candidate
  permit_params :user_id, :status, :file, :candidate_id

  index do
    selectable_column
    column :id
    column :candidate
    column :user
    column :file
    actions
  end

  form do |f|
    f.inputs 'Admin Details' do
      f.input :user_id, :as => :select, :collection => User.all.map{|u| ["#{u.email}", u.id]}
      f.input :candidate
      f.input :file,  as: :file
    end
    f.actions
  end
end

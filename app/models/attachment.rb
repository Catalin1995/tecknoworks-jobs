class Attachment < ActiveRecord::Base
  belongs_to :job

  mount_uploader :file
  mount_uploader :file, FileUploader

  validates :job, presence: true
  validates :status, presence: true
  # validates :file, presence: true
end
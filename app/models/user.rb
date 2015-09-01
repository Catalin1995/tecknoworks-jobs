class User < ActiveRecord::Base
  has_many :attachments
  has_many :interviews
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :trackable, :validatable

  def self.current_logged_user
    return current_admin_user
  end
end

require 'net-ldap'

# Used to perform LDAP authentication.
#
# Configured from environment variables:
#
# * JOBS_LDAP_USER
# * JOBS_LDAP_PASS
# * JOBS_LDAP_HOST
# * JOBS_LDAP_BASE_DN
#
class Ldap
  def initialize(options = {})
    options[:user] ||= ENV['JOBS_LDAP_USER'] || ''
    options[:pass] ||= ENV['JOBS_LDAP_PASS'] || ''
    options[:host] ||= ENV['JOBS_LDAP_HOST'] || ''
    options[:base_dn] ||= ENV['JOBS_LDAP_BASE_DN'] || ''
    @options = options
  end

  # Desribe the behaviour of the method
  #
  # ==== Attributes
  #
  # * +auth_hash+ - Authentication hash filtered by
  #                 Devise::SessionsController#sign_in_params
  #
  # ==== Examples
  #
  # Ldap.new.valid?(email: 'test@email.com', password: 'password')
  #
  def valid?(auth_hash)
    return false if auth_hash[:email].blank? || auth_hash[:password].blank?
    user_dn = user_exists?(auth_hash[:email])
    ldap = auth_user user_dn, auth_hash[:password]
    ldap.bind
  rescue Net::LDAP::BindingInformationInvalidError
    false
  rescue Net::LDAP::LdapError
    false
  end

  private

  def auth_user(username, password)
    ldap_connection username, password
  end

  def user_exists?(username)
    ldap = ldap_connection(construct_dn(@options[:user]), @options[:pass])

    user = nil
    ldap.search(base: @options[:base_dn], attributes: %w(dn mail)) do |entry|
      user = entry[:dn][0] if entry[:mail][0] == username
    end

    user
  end

  def ldap_connection(username, password)
    ldap = Net::LDAP.new
    ldap.host = @options[:host]
    ldap.authenticate username, password
    ldap
  end

  def construct_dn(username)
    "cn=#{username},#{@options[:base_dn]}"
  end
end

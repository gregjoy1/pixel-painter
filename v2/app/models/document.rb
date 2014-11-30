class Document < ActiveRecord::Base
	belongs_to :account
	validates_presence_of :name
	validates_presence_of :json
	validates_presence_of :account_id
end
